### AI 학습 매뉴얼

#### 학습 데이터셋
- AI Hub: 실내(편의점, 매장) 사람 이상행동 데이터
- https://aihub.or.kr/aihubdata/data/view.do?currMenu=&topMenu=&aihubDataSe=realm&dataSetSn=71550
- 절도, 파손, 흡연, 방화, 실신 5가지 카테고리에 대하여 랜덤으로 80개씩 섞어 raw/batch_001... 순으로 영상 데이터 및 라벨링 데이터셋을 배치
- 검증 데이터셋은 val/theft... 식으로 영상 데이터를 배치함

#### 학습 환경
- Ubuntu
- Nvidia Tesla V-100
- Cuda Toolkit 12.2

#### 학습 실행
1. Conda 설치
```
# Miniconda 설치 스크립트 다운로드
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 설치 스크립트 실행
bash Miniconda3-latest-Linux-x86_64.sh

# 설치가 완료된 후 터미널 재실행 또는 아래 명령어 실행
source ~/.bashrc

```
2. Conda 환경 설정
- `conda create --name <new_env_name> --file environment.txt`
  - conda 환경을 설정하고, 필요한 패키지를 설치
  - `<new_env_name>`은 설정하고 싶은 환경의 이름으로 대체

3. 학습 및 검증 실행
- `result/scripts/train_gpu.py` 를 실행
- 실행 명령어는 `train_gpu.sh`

#### 모델 서빙
1. `archive_ensemble_model`로 result/models 의 두 모델에 대한 앙상블 .mar 파일을 생성
2. `initialize_torchserve`로 torchserve 를 실행하여 앙상블 모델 서빙
