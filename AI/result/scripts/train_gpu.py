import os
import torch
import logging
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import numpy as np
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
from torch.amp import GradScaler, autocast  # PyTorch >= 2.0
from torch.optim.lr_scheduler import CosineAnnealingLR
from pytorchvideo.models.hub import slowfast_r50, x3d_m
from pytorchvideo.transforms import UniformTemporalSubsample, ShortSideScale, Normalize
import av
import time

# 로깅 설정
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# 파일 핸들러 추가 (로그를 파일에 저장)
file_handler = logging.FileHandler('train_gpu.log')
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# 콘솔 핸들러 추가 (로그를 콘솔에 출력)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# 디바이스 설정 및 버전 정보 로깅
logger.info(f"PyTorch version: {torch.__version__}")
logger.info(f"CUDA version: {torch.version.cuda}")
logger.info(f"CUDA available: {torch.cuda.is_available()}")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using {device} device")

def load_video(video_path):
    """
    PyAV를 사용하여 비디오를 로드하고 텐서로 변환하는 함수
    
    Args:
        video_path (str): 비디오 파일 경로
    
    Returns:
        torch.Tensor: 로드된 비디오 텐서 (C, T, H, W 형식)
    """
    try:
        # PyAV를 사용하여 비디오 파일 열기
        logger.debug(f"Loading video with PyAV: {video_path}")
        container = av.open(video_path)
        frames = []

        # 비디오의 각 프레임을 디코딩하고 RGB 형식으로 변환
        for frame in container.decode(video=0):
            img = frame.to_rgb().to_ndarray()
            frames.append(img)

        # 프레임이 없는 경우 처리
        if not frames:
            logger.warning(f"No frames found in video: {video_path}")
            return None
        
        # 프레임들을 numpy 배열로 스택
        video = np.stack(frames)

        # numpy 배열을 PyTorch 텐서로 변환 (C, T, H, W 형식)
        video_tensor = torch.from_numpy(video.copy()).permute(3, 0, 1, 2).float()
        logger.debug(f"Loaded video tensor shape: {video_tensor.shape}")
        return video_tensor
    except Exception as e:
        logger.error(f"Error loading video with PyAV: {video_path}, error: {str(e)}")
        return None

class BatchFolderDataset(Dataset):
    """
    배치 폴더별로 비디오를 로드하는 데이터셋 클래스
    """
    def __init__(self, batch_folder_path, transform=None):
        self.batch_folder_path = batch_folder_path
        self.transform = transform
        self.label_mapping = {12: 0, 8: 1, 9: 2, 10: 3, 7: 4}
        self.videos = self.load_videos()

    def load_videos(self):
        """
        지정된 배치 폴더에서 비디오 파일들을 로드하는 메서드
        """
        videos = []
        logger.info(f"Loading videos from: {self.batch_folder_path}")

        # 배치 폴더 내의 모든 비디오 파일에 대해 반복
        for video_file in sorted(os.listdir(self.batch_folder_path)):
            if video_file.lower().endswith('.mp4'):
                video_path = os.path.join(self.batch_folder_path, video_file)
                # 파일 이름에서 레이블 추출
                parts = video_file.split('_')
                if len(parts) >= 3:
                    try:
                        original_label = int(parts[2])
                        if original_label in self.label_mapping:
                            label = self.label_mapping[original_label]
                            videos.append((video_path, label))
                        else:
                            logger.warning(f"Unknown label {original_label} in file {video_file}")
                    except ValueError:
                        logger.warning(f"Failed to convert label to int from filename: {video_file}")
                else:
                    logger.warning(f"Failed to extract label from filename: {video_file}")
        logger.info(f"Total videos loaded from {self.batch_folder_path}: {len(videos)}")
        return videos

    def __len__(self):
        return len(self.videos)

    def __getitem__(self, idx):
        """
        데이터셋에서 단일 아이템을 가져오는 메서드
        """
        try:
            video_path, label = self.videos[idx]
            # 비디오 로드
            video_tensor = load_video(video_path)
            if video_tensor is None:
                raise IndexError(f"Invalid sample at index {idx}")
            
            # 변환 적용 (있는 경우)
            if self.transform:
                video_tensor = self.transform(video_tensor)
            label = torch.tensor(label, dtype=torch.long)
            return video_tensor, label
        except Exception as e:
            logger.error(f"Error loading sample at index {idx}: {str(e)}")
            raise IndexError(f"Invalid sample at index {idx}")

def validate_model(model, val_path, criterion, device, epoch, model_name, batch_size):
    """
    모델 검증을 수행하는 함수
    
    Args:
        model: 검증할 모델
        val_path: 검증 데이터 경로
        criterion: 손실 함수
        device: 사용할 디바이스 (CPU/GPU)
        epoch: 현재 에폭
        model_name: 모델 이름 ('x3d' 또는 'slowfast')
        batch_size: 배치 크기
    
    Returns:
        float: 검증 손실 값
    """
    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_labels = []
    category_correct = {i: 0 for i in range(5)}
    category_total = {i: 0 for i in range(5)}

    with torch.no_grad():
        # 각 카테고리별로 검증 수행
        for category in os.listdir(val_path):
            category_path = os.path.join(val_path, category)
            category_dataset = BatchFolderDataset(category_path, transform=transform)
            if len(category_dataset) == 0:
                raise ValueError(f"{category_path}에 비디오가 없습니다. 데이터셋을 확인하세요.")
            category_loader = DataLoader(category_dataset, batch_size=batch_size, shuffle=False, num_workers=8, pin_memory=True)

            for inputs, labels in category_loader:
                # None 값 필터링
                valid_indices = [i for i, input in enumerate(inputs) if input is not None]
                if not valid_indices:
                    continue
                inputs = torch.stack([inputs[i] for i in valid_indices])
                labels = torch.stack([labels[i] for i in valid_indices])

                inputs = inputs.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)

                # Mixed precision 추론 사용
                with autocast(device_type='cuda', dtype=torch.float16):
                    if model_name == 'slowfast':
                        # SlowFast 모델을 위한 입력 준비
                        fast_pathway = inputs
                        indices = torch.linspace(0, inputs.shape[2] - 1, inputs.shape[2] // 4).long().to(device)
                        slow_pathway = torch.index_select(inputs, 2, indices)
                        outputs = model([slow_pathway, fast_pathway])
                    else:  # x3d
                        outputs = model(inputs)

                    loss = criterion(outputs, labels)

                val_loss += loss.item()

                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

                all_preds.extend(predicted.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

                # 카테고리별 정확도 계산
                for label, pred in zip(labels, predicted):
                    category_total[label.item()] += 1
                    if label == pred:
                        category_correct[label.item()] += 1

    # 검증 결과 계산 및 로깅
    val_loss /= total if total > 0 else 1
    accuracy = 100 * correct / total if total > 0 else 0

    logger.info(f"{model_name} - Validation Loss: {val_loss:.4f}, Accuracy: {accuracy:.2f}%")
    for category in category_correct:
        if category_total[category] > 0:
            cat_accuracy = 100 * category_correct[category] / category_total[category]
            logger.info(f"{model_name} - Category {category} Accuracy: {cat_accuracy:.2f}%")
        else:
            logger.info(f"{model_name} - Category {category} Accuracy: N/A (No samples)")

    # 혼동 행렬 생성 및 저장
    if all_labels and all_preds:
        cm = confusion_matrix(all_labels, all_preds)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d')
        plt.title(f'{model_name} Confusion Matrix - Epoch {epoch+1}')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        plt.savefig(f'{model_name}_confusion_matrix_epoch_{epoch+1}.png')
        plt.close()

    return val_loss

def save_onnx_model(model, model_name):
    """
    학습된 모델을 ONNX 형식으로 저장하는 함수
    
    Args:
        model: 저장할 모델
        model_name: 모델 이름 ('x3d' 또는 'slowfast')
    """
    model.eval()
    try:
        if model_name == 'slowfast':
            # SlowFast 모델을 위한 더미 입력 생성
            dummy_input = torch.randn(1, 3, 32, 224, 224).to(device)
            fast_pathway = dummy_input
            indices = torch.linspace(0, dummy_input.shape[2] - 1, dummy_input.shape[2] // 4).long().to(device)
            slow_pathway = torch.index_select(dummy_input, 2, indices)
            dummy_input = [slow_pathway, fast_pathway]
            input_names = ['slow_input', 'fast_input']
        else:
            # X3D 모델을 위한 더미 입력 생성
            dummy_input = torch.randn(1, 3, 32, 224, 224).to(device)
            input_names = ['input']

        output_names = ['output']
        # ONNX 모델 내보내기
        torch.onnx.export(model, dummy_input, f"{model_name}.onnx",
                          input_names=input_names, output_names=output_names,
                          opset_version=11,
                          dynamic_axes={'slow_input': {0: 'batch_size'},
                                        'fast_input': {0: 'batch_size'},
                                        'input': {0: 'batch_size'},
                                        'output': {0: 'batch_size'}} if model_name == 'slowfast' else 
                                       {'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}})
        logger.info(f"ONNX model saved: {model_name}.onnx")
    except Exception as e:
        logger.error(f"Error saving {model_name} model to ONNX: {str(e)}")

def train_models_alternating_with_switching(x3d_model, slowfast_model, train_root_dir, val_path, x3d_criterion, slowfast_criterion, 
                                            x3d_optimizer, slowfast_optimizer, num_epochs, device, x3d_batch_size, slowfast_batch_size, 
                                            patience=5, accumulation_steps=4):
    """
    X3D와 SlowFast 모델을 번갈아가며 학습하는 함수
    
    Args:
        x3d_model: X3D 모델
        slowfast_model: SlowFast 모델
        train_root_dir: 학습 데이터 루트 디렉토리
        val_path: 검증 데이터 경로
        x3d_criterion: X3D 모델의 손실 함수
        slowfast_criterion: SlowFast 모델의 손실 함수
        x3d_optimizer: X3D 모델의 옵티마이저
        slowfast_optimizer: SlowFast 모델의 옵티마이저
        num_epochs: 총 에폭 수
        device: 사용할 디바이스 (CPU/GPU)
        x3d_batch_size: X3D 모델의 배치 크기
        slowfast_batch_size: SlowFast 모델의 배치 크기
        patience: 조기 종료를 위한 인내심
        accumulation_steps: 그래디언트 누적 단계
    """
    # Gradient Scaler 초기화 (Mixed Precision 학습을 위함)
    x3d_scaler = GradScaler()
    slowfast_scaler = GradScaler()
    # 학습률 스케줄러 초기화
    x3d_scheduler = CosineAnnealingLR(x3d_optimizer, T_max=num_epochs)
    slowfast_scheduler = CosineAnnealingLR(slowfast_optimizer, T_max=num_epochs)

    best_x3d_val_loss = float('inf')
    best_slowfast_val_loss = float('inf')
    x3d_epochs_no_improve = 0
    slowfast_epochs_no_improve = 0

    for epoch in range(num_epochs):
        for model_type in ['x3d', 'slowfast']:
            epoch_start_time = time.time()

            # 현재 모델 및 관련 객체 설정
            if model_type == 'x3d':
                current_model = x3d_model
                current_criterion = x3d_criterion
                current_optimizer = x3d_optimizer
                current_scaler = x3d_scaler
                current_scheduler = x3d_scheduler
                current_batch_size = x3d_batch_size
            else:
                current_model = slowfast_model
                current_criterion = slowfast_criterion
                current_optimizer = slowfast_optimizer
                current_scaler = slowfast_scaler
                current_scheduler = slowfast_scheduler
                current_batch_size = slowfast_batch_size

            # 이전 에폭에서 저장된 모델 로드
            if epoch > 0:
                try:
                    current_model.load_state_dict(torch.load(f"{model_type}_model_epoch_{epoch}.pth"))
                    logger.info(f"Loaded {model_type} model from epoch {epoch}")
                except FileNotFoundError:
                    logger.warning(f"No saved model found for {model_type} at epoch {epoch}. Using the current model.")

            current_model.to(device)
            current_model.train()
            running_loss = 0.0
            batch_count = 0

            # 학습 데이터 로드 (배치 폴더별로)
            for batch_folder in sorted(os.listdir(train_root_dir)):
                batch_folder_path = os.path.join(train_root_dir, batch_folder)
                if not os.path.isdir(batch_folder_path):
                    continue

                train_dataset = BatchFolderDataset(batch_folder_path, transform=transform)
                if len(train_dataset) == 0:
                    logger.warning(f"No valid videos found in {batch_folder_path}, skipping.")
                    continue

                train_loader = DataLoader(train_dataset, batch_size=current_batch_size, shuffle=True, num_workers=16, pin_memory=True)

                for batch_idx, (inputs, labels) in enumerate(train_loader):
                    inputs, labels = inputs.to(device, non_blocking=True), labels.to(device, non_blocking=True)
                    current_optimizer.zero_grad()

                    # Mixed precision 학습 사용
                    with autocast(device_type='cuda', dtype=torch.float16):
                        if model_type == 'slowfast':
                            # SlowFast 모델을 위한 입력 준비
                            fast_pathway = inputs
                            indices = torch.linspace(0, inputs.shape[2] - 1, inputs.shape[2] // 4).long().to(device)
                            slow_pathway = torch.index_select(inputs, 2, indices)
                            outputs = current_model([slow_pathway, fast_pathway])
                        else:
                            outputs = current_model(inputs)

                        loss = current_criterion(outputs, labels)
                        loss = loss / accumulation_steps  # Gradient Accumulation

                    # Gradient scaling 적용
                    current_scaler.scale(loss).backward()

                    if (batch_count + 1) % accumulation_steps == 0:
                        current_scaler.step(current_optimizer)
                        current_scaler.update()
                        current_optimizer.zero_grad()

                    running_loss += loss.item() * accumulation_steps
                    batch_count += 1

            # 평균 손실 계산
            epoch_loss = running_loss / batch_count if batch_count > 0 else 0.0
            logger.info(f"{model_type} - Epoch [{epoch+1}/{num_epochs}], Average Loss: {epoch_loss:.4f}")

            # 검증 수행
            val_loss = validate_model(current_model, val_path, current_criterion, device, epoch, model_type, current_batch_size)

            # 학습률 스케줄러 업데이트
            current_scheduler.step()

            # 가장 좋은 모델 저장 및 조기 종료 확인
            if model_type == 'x3d':
                if val_loss < best_x3d_val_loss:
                    best_x3d_val_loss = val_loss
                    x3d_epochs_no_improve = 0
                    torch.save(current_model.state_dict(), f"{model_type}_best_model.pth")
                    logger.info(f"Best {model_type} model saved with validation loss: {best_x3d_val_loss:.4f}")
                else:
                    x3d_epochs_no_improve += 1
            else:
                if val_loss < best_slowfast_val_loss:
                    best_slowfast_val_loss = val_loss
                    slowfast_epochs_no_improve = 0
                    torch.save(current_model.state_dict(), f"{model_type}_best_model.pth")
                    logger.info(f"Best {model_type} model saved with validation loss: {best_slowfast_val_loss:.4f}")
                else:
                    slowfast_epochs_no_improve += 1

            # 현재 에폭의 모델 저장
            torch.save(current_model.state_dict(), f"{model_type}_model_epoch_{epoch+1}.pth")

            # GPU에서 현재 모델 제거 (메모리 절약)
            current_model.to('cpu')
            torch.cuda.empty_cache()

            epoch_end_time = time.time()
            epoch_duration = epoch_end_time - epoch_start_time
            logger.info(f"{model_type} - Epoch [{epoch+1}/{num_epochs}] completed. Duration: {epoch_duration:.2f} sec")

        # 조기 종료 조건 확인
        if x3d_epochs_no_improve >= patience and slowfast_epochs_no_improve >= patience:
            logger.info("Early stopping triggered for both models.")
            break

    # 학습 종료 후 GPU 메모리 정리
    torch.cuda.empty_cache()

# 메인 실행 코드
if __name__ == "__main__":
    # 데이터 전처리 설정
    transform = transforms.Compose([
        UniformTemporalSubsample(32),  # 시간 축에서 32개의 프레임을 균일하게 샘플링
        transforms.Lambda(lambda x: x / 255.0),  # 픽셀 값을 0-1 범위로 정규화
        Normalize((0.45, 0.45, 0.45), (0.225, 0.225, 0.225)),  # 평균과 표준편차로 정규화
        ShortSideScale(256),  # 짧은 쪽의 크기를 256으로 조정
        transforms.CenterCrop(224),  # 중앙에서 224x224 크기로 크롭
    ])

    # 학습 및 검증 데이터 경로 설정
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    raw_train_path = "./data/raw/train_batches"
    raw_val_path = "./data/raw/val"

    # 배치 크기 및 에폭 수 설정
    x3d_batch_size = 32
    slowfast_batch_size = 16
    epoch_size = 100

    # 학습률 설정 (배치 크기에 비례하여 조정)
    x3d_learning_rate = 1e-4 * (x3d_batch_size / 16)
    slowfast_learning_rate = 1e-4 * (slowfast_batch_size / 8)

    # X3D 모델 초기화 및 설정
    x3d_model = x3d_m(pretrained=True)
    x3d_model.blocks[-1].proj = nn.Linear(in_features=x3d_model.blocks[-1].proj.in_features, out_features=5)
    x3d_model = x3d_model.to(device)
    x3d_criterion = nn.CrossEntropyLoss()
    x3d_optimizer = torch.optim.Adam(x3d_model.parameters(), lr=x3d_learning_rate)

    # SlowFast 모델 초기화 및 설정
    slowfast_model = slowfast_r50(pretrained=True)
    slowfast_model.blocks[-1].proj = nn.Linear(in_features=slowfast_model.blocks[-1].proj.in_features, out_features=5)
    slowfast_model = slowfast_model.to(device)
    slowfast_criterion = nn.CrossEntropyLoss()
    slowfast_optimizer = torch.optim.Adam(slowfast_model.parameters(), lr=slowfast_learning_rate)

    # Gradient Accumulation 단계 수 설정
    accumulation_steps = 4  # 4번의 배치마다 가중치 업데이트

    # 모델 학습 (X3D와 SlowFast를 번갈아가며 학습, 모델 스위칭 포함)
    try:
        train_models_alternating_with_switching(
            x3d_model, slowfast_model, raw_train_path, raw_val_path, 
            x3d_criterion, slowfast_criterion, x3d_optimizer, slowfast_optimizer, 
            num_epochs=epoch_size, device=device, 
            x3d_batch_size=x3d_batch_size, slowfast_batch_size=slowfast_batch_size, 
            patience=5, accumulation_steps=accumulation_steps
        )
    except torch.cuda.OutOfMemoryError as e:
        logger.error(f"CUDA Out of Memory during training: {str(e)}")
        torch.cuda.empty_cache()

    # 학습된 모델을 ONNX로 변환하여 저장
    try:
        x3d_model.load_state_dict(torch.load("x3d_best_model.pth"))
        slowfast_model.load_state_dict(torch.load("slowfast_best_model.pth"))
        save_onnx_model(x3d_model, 'x3d')
        save_onnx_model(slowfast_model, 'slowfast')
    except Exception as e:
        logger.error(f"Error saving models to ONNX: {str(e)}")