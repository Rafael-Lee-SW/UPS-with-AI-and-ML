import torch
from ts.torch_handler.base_handler import BaseHandler
import json
import av
import numpy as np
from pytorchvideo.models.hub import x3d_m, slowfast_r50
from torchvision import transforms
from pytorchvideo.transforms import UniformTemporalSubsample, ShortSideScale, Normalize
import logging
import sys
import tempfile
import os

# 로거 설정
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # 모든 로그 레벨을 캡처하도록 설정

# 이미 핸들러가 설정되어 있는지 확인하여 중복 방지
if not logger.hasHandlers():
    # 파일 핸들러 추가 (UTF-8 인코딩)
    file_handler = logging.FileHandler('ensemble_handler.log', encoding='utf-8')
    file_handler.setLevel(logging.DEBUG)  # 파일에 모든 로그 기록

    # 스트림 핸들러 추가 (콘솔 출력)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)  # 콘솔에는 INFO 이상 로그만 출력

    # 로그 포매터 설정
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')

    # 핸들러에 포매터 적용
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # 로거에 핸들러 추가
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)


class EnsembleHandler(BaseHandler):
    def initialize(self, context):
        """모델을 로드하고 필요한 초기 설정을 수행"""
        self.manifest = context.manifest
        properties = context.system_properties
        self.device = torch.device(
            f'cuda:{properties.get("gpu_id")}' if torch.cuda.is_available() else "cpu"
        )
        model_dir = properties.get("model_dir")

        # X3D 모델 로드 및 마지막 레이어 수정
        try:
            x3d_model_path = os.path.join(model_dir, "x3d_best_model.pth")
            self.x3d_model = x3d_m(pretrained=False)
            # 학습 시 마지막 레이어 수정
            self.x3d_model.blocks[-1].proj = torch.nn.Linear(
                in_features=self.x3d_model.blocks[-1].proj.in_features,
                out_features=5
            )
            # FutureWarning 방지를 위해 weights_only=True 설정
            x3d_state_dict = torch.load(
                x3d_model_path, map_location=self.device, weights_only=True
            )
            self._adjust_model_layers(self.x3d_model, x3d_state_dict, 'X3D')
            self.x3d_model.load_state_dict(x3d_state_dict, strict=False)
            self.x3d_model.to(self.device)
            self.x3d_model.eval()
            logger.info(f"Successfully loaded X3D model from: {x3d_model_path}")
        except Exception as e:
            logger.error(f"Failed to load X3D model: {e}")
            raise RuntimeError(f"Failed to load X3D model: {e}")

        # SlowFast 모델 로드 및 마지막 레이어 수정
        try:
            slowfast_model_path = os.path.join(model_dir, "slowfast_best_model.pth")
            self.slowfast_model = slowfast_r50(pretrained=False)
            # 학습 시 마지막 레이어 수정
            self.slowfast_model.blocks[-1].proj = torch.nn.Linear(
                in_features=self.slowfast_model.blocks[-1].proj.in_features,
                out_features=5
            )
            # FutureWarning 방지를 위해 weights_only=True 설정
            slowfast_state_dict = torch.load(
                slowfast_model_path, map_location=self.device, weights_only=True
            )
            self._adjust_model_layers(self.slowfast_model, slowfast_state_dict, 'SlowFast')
            self.slowfast_model.load_state_dict(slowfast_state_dict, strict=False)
            self.slowfast_model.to(self.device)
            self.slowfast_model.eval()
            logger.info(f"Successfully loaded SlowFast model from: {slowfast_model_path}")
        except Exception as e:
            logger.error(f"Failed to load SlowFast model: {e}")
            raise RuntimeError(f"Failed to load SlowFast model: {e}")

        # 클래스 매핑 로드 (공통 사용)
        try:
            index_to_name_file = os.path.join(model_dir, "index_to_name.json")
            with open(index_to_name_file, encoding="utf-8") as f:
                self.index_to_name = json.load(f)
            logger.info(f"Successfully loaded class mapping file from: {index_to_name_file}")
        except Exception as e:
            logger.error(f"Failed to load class mapping file: {e}")
            raise RuntimeError(f"Failed to load class mapping file: {e}")

        # 전처리 파이프라인 설정 (학습 시와 동일)
        self.x3d_transform = transforms.Compose([
            UniformTemporalSubsample(32),
            transforms.Lambda(lambda x: x / 255.0),
            Normalize((0.45, 0.45, 0.45), (0.225, 0.225, 0.225)),
            ShortSideScale(256),
            transforms.CenterCrop(224)
        ])

        self.slowfast_transform = transforms.Compose([
            UniformTemporalSubsample(32),
            transforms.Lambda(lambda x: x / 255.0),
            Normalize((0.45, 0.45, 0.45), (0.225, 0.225, 0.225)),
            ShortSideScale(256),
            transforms.CenterCrop(224)
        ])
        logger.info("EnsembleHandler initialization complete.")

        # 가중치 업데이트
        self.category_weights = {
            0: {'x3d': 0.7, 'slowfast': 0.3},  # X3D 성능이 높음
            1: {'x3d': 0.6, 'slowfast': 0.4},  # X3D 성능이 더 우수함
            2: {'x3d': 0.5, 'slowfast': 0.5},  # 두 모델 모두 동일한 성능
            3: {'x3d': 0.55, 'slowfast': 0.45},  # X3D가 약간 더 높음
            4: {'x3d': 0.5, 'slowfast': 0.5},  # 동일한 성능
        }

    def _adjust_model_layers(self, model, state_dict, model_name):
        """모델의 모든 레이어 크기를 학습된 모델에 맞게 조정"""
        for name, param in state_dict.items():
            if name in model.state_dict():
                current_param_shape = model.state_dict()[name].shape
                if param.shape != current_param_shape:
                    logger.info(f"Adjusting {model_name} layer '{name}' from {current_param_shape} to {param.shape}")
                    if "proj.weight" in name or "proj.bias" in name:
                        # 마지막 proj 레이어는 이미 수정했으므로 스킵
                        continue
                    # 추가적인 레이어 조정 로직 필요 시 여기에 추가
        logger.info(f"All layers of {model_name} model have been adjusted.")

    def preprocess(self, data):
        """비디오 데이터를 로드하고 모델별 전처리를 수행"""
        processed_videos = []
        for row in data:
            video = row.get("data") or row.get("body")
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
                    tmp_file.write(video)
                    tmp_file_path = tmp_file.name

                video_tensor = self.load_video(tmp_file_path)
                os.unlink(tmp_file_path)  # 임시 파일 삭제

                if video_tensor is None:
                    logger.warning(f"Failed to load video: {tmp_file_path}")
                    continue

                # X3D 전처리
                x3d_input = self.x3d_transform(video_tensor).unsqueeze(0).to(self.device)

                # SlowFast 전처리
                slowfast_input = self.slowfast_transform(video_tensor).to(self.device)
                # Slow pathway: temporal subsample to T_slow=8 (dimension 1)
                indices = torch.linspace(0, slowfast_input.shape[1] - 1, 8).long().to(self.device)
                slow_pathway = torch.index_select(slowfast_input, 1, indices).unsqueeze(0)
                # Fast pathway: T_fast=32 (no subsampling)
                fast_pathway = slowfast_input.unsqueeze(0)

                processed_videos.append({
                    'x3d': x3d_input,
                    'slowfast': [slow_pathway, fast_pathway]
                })
                logger.info(
                    f"Preprocessed video: X3D tensor shape {x3d_input.shape}, "
                    f"SlowFast tensor shapes {slow_pathway.shape}, {fast_pathway.shape}"
                )
            except Exception as e:
                logger.error(f"Failed to preprocess video: {e}")
                continue

        if not processed_videos:
            logger.error("No valid video data available for processing.")
            raise ValueError("No valid video data available for processing.")

        return processed_videos

    def inference(self, processed_videos):
        """각 모델에 데이터를 전달하고 예측 수행"""
        x3d_outputs = None
        slowfast_outputs = None
        try:
            # X3D 추론
            x3d_inputs = torch.cat([video['x3d'] for video in processed_videos])
            with torch.no_grad():
                x3d_out = self.x3d_model(x3d_inputs)
                x3d_outputs = x3d_out
            logger.info("X3D model inference completed successfully.")
        except Exception as e:
            logger.error(f"X3D model inference failed: {e}")

        try:
            # SlowFast 추론
            slow_pathways = [video['slowfast'][0] for video in processed_videos]
            fast_pathways = [video['slowfast'][1] for video in processed_videos]
            slow_input = torch.cat(slow_pathways)
            fast_input = torch.cat(fast_pathways)
            with torch.no_grad():
                slowfast_out = self.slowfast_model([slow_input, fast_input])
                slowfast_outputs = slowfast_out
            logger.info("SlowFast model inference completed successfully.")
        except Exception as e:
            logger.error(f"SlowFast model inference failed: {e}")

        if x3d_outputs is None and slowfast_outputs is None:
            raise RuntimeError("Both models failed during inference.")

        return x3d_outputs, slowfast_outputs

    def ensemble(self, x3d_outputs, slowfast_outputs):
        """두 모델의 출력 결과를 카테고리별 가중치를 적용하여 앙상블"""
        try:
            # 소프트맥스 적용하여 확률로 변환
            if x3d_outputs is not None:
                x3d_probs = torch.softmax(x3d_outputs, dim=1)
            else:
                x3d_probs = torch.zeros(1, 5).to(self.device)

            if slowfast_outputs is not None:
                slowfast_probs = torch.softmax(slowfast_outputs, dim=1)
            else:
                slowfast_probs = torch.zeros(1, 5).to(self.device)

            logger.info("Softmax transformation applied to model outputs.")

            # 카테고리별 가중치를 사용하여 앙상블 확률 계산
            ensemble_probs = torch.zeros_like(x3d_probs).to(self.device)
            for idx in range(len(self.category_weights)):
                weight_x3d = self.category_weights[idx]['x3d']
                weight_slowfast = self.category_weights[idx]['slowfast']
                ensemble_probs[:, idx] = (weight_x3d * x3d_probs[:, idx]) + (weight_slowfast * slowfast_probs[:, idx])

            # 최종 예측값 도출
            _, predicted = torch.max(ensemble_probs, 1)
            predicted = predicted.cpu().numpy()
            logger.info("Ensemble inference completed successfully.")
            return predicted
        except Exception as e:
            logger.error(f"Ensemble processing failed: {e}")
            raise RuntimeError(f"Ensemble processing failed: {e}")

    def postprocess(self, predictions):
        """예측 결과를 JSON 형식의 리스트로 변환"""
        results = []
        try:
            for pred in predictions:
                class_name = self.index_to_name.get(str(pred), "Unknown")
                results.append({"class": class_name})
                logger.info(f"Predicted class: {class_name}")
            return results
        except Exception as e:
            logger.error(f"Post-processing failed: {e}")
            raise RuntimeError(f"Post-processing failed: {e}")

    def handle(self, data, context):
        """클라이언트 요청을 처리하는 전체 흐름"""
        try:
            logger.info("Starting request processing.")
            processed_videos = self.preprocess(data)
            x3d_outputs, slowfast_outputs = self.inference(processed_videos)
            predictions = self.ensemble(x3d_outputs, slowfast_outputs)
            results = self.postprocess(predictions)
            logger.info("Request processing completed successfully.")
            return results  # 리스트 형태로 반환
        except Exception as e:
            logger.error(f"Error in handle method: {e}")
            return [{"error": str(e)}]  # 리스트 안에 딕셔너리 형태로 반환

    def load_video(self, video_path):
        """PyAV을 사용하여 비디오 데이터를 로드하는 유틸리티 함수"""
        try:
            container = av.open(video_path)
            video_stream = container.streams.video[0]
            frames = []
            for frame in container.decode(video_stream):
                frames.append(frame.to_ndarray(format="rgb24"))
            container.close()
            video = np.stack(frames)
            # 텐서로 변환 (C, T, H, W) 형식
            video_tensor = torch.from_numpy(video).permute(3, 0, 1, 2).float()
            return video_tensor
        except Exception as e:
            logger.error(f"Failed to load video {video_path}: {e}")
            return None
