#  Auto Store Project : 무인 매장 관리 시스템  

<img src="/READMEfile/unmanndestore.jpg" alt="AUTOSTORE Image" width="1000">


# 목차
- [📌 프로젝트 소개](#-Automatic-Store-프로젝트-소개)
- [🤖 AI 기술](#-AI-기술)
- [# AI 외 기능](#-AI-외-기능)
- [👥 팀 소개](#-팀-소개)
- [⏱ 개발 기간](#-개발-기간)
- [📅 개선 일지](#-개선-일지)
- [🛠️ 기술 스택](#-기술-스택)
- [🎋 브랜치 전략](#-브랜치-전략)
- [📜 커밋 컨벤션](#-커밋-컨벤션)
- [📄 프로젝트 구조](#-프로젝트-구조)
- [🌐 포팅 매뉴얼](#-포팅-매뉴얼) 
- [💻 서비스 화면](#-서비스-화면)
- [📝 프로젝트 후기](#-프로젝트-후기 )

<br>

- 배포 URL :http://j11a302.p.ssafy.io/
- Test ID : test@naver.com
- Test PW : asdfasdf12

<br>

## 주요 요소

### 📷 AI 매장 이상 감지(도난, 파손, 실신, 방화, 흡연연) 

### 📑 상품 수요 예측(Machine Learning)

### 🖥️ Kiosk 서비스

### 📋 재고 관리(Order Fulfillment)

### 🖥 물류 정보 시스템(Logistics Information Systems)

<br>

# 📌 Auto Store 프로젝트 소개

Auto Store는 무인 매장의 사장님이 원격으로 매장을 관리할 수 있도록 설계된 프로젝트입니다. 또한 AI를 활용해 매장의 이상 현상을 감지하고, 과거의 판매 데이터를 분석하여 미래 수요를 예측함으로써 발주 시기를 최적화합니다.

# 🤖 AI 기술

### 📷 이상 감지 시스템 (Anomaly Detection)
- CCTV 영상 데이터를 실시간으로 분석하여 도난, 파손, 실신, 방화, 흡연 등의 이상 행동을 감지합니다.
- **TorchServe**를 통해 학습된 AI 모델을 배포하고 GPU 서버를 사용하여 고성능으로 영상 데이터를 처리합니다.
- 감지된 이상 현상은 즉시 사장님에게 알림을 보내어 빠르게 대처할 수 있도록 지원합니다.

### 📊 판매 데이터 분석 및 수요 예측
- 시계열 판매 데이터를 기반으로 **FastAPI**와 연동된 머신러닝 모델이 미래 수요를 예측합니다.
- 과거 판매 패턴을 분석하여 최적의 발주 시기를 제안하고, 안전 재고를 유지할 수 있도록 도와줍니다.
- 예측 모델은 지속적으로 데이터를 학습하여 점점 더 정확한 예측을 제공합니다.

### 🔍 AI 모델 학습 및 배포
- **TorchServe**와 **Amazon S3**를 이용하여 AI 모델을 효율적으로 학습하고 배포합니다.
- 모델 학습 과정은 GPU 서버에서 병렬 처리되어 빠르게 진행되며, 학습된 모델은 실시간으로 배포되어 매장 운영에 반영됩니다.
- 이상 현상 감지 및 수요 예측 외에도 추가적인 AI 기능 확장을 고려하여 확장 가능한 아키텍처로 설계되었습니다.

### 💡 AI의 장점
- **실시간 처리**: CCTV 및 판매 데이터를 실시간으로 분석하여 즉각적인 대응이 가능.
- **예측성**: 판매 데이터의 예측을 통해 재고 관리 및 발주 주기를 최적화하여 비용 절감.
- **확장 가능성**: TorchServe 및 FastAPI 기반의 AI 시스템으로, 다른 매장 데이터에도 적용 가능하며 모델 확장 용이.

# AI 외 기능

### 🖥️ Kiosk 서비스
- exe 파일로 매장의 키오스크를 관리 할 수 있습니다. 
- OTP와 JWT 토큰을 활용하여 매장의 보안을 강화합니다. 


### 📋 재고 관리
- PWA를 활용하여 사장님은 모바일 폰으로 언제든지 매장의 재고 수량을 확인 할 수 있습니다.
- 선반의 재고가 부족한 것을 실시간으로 확인 가능합니다.

# AUTO STORE 의 가치

 **저비용**: 최소한의 비용으로 무인 매장을 관리합니다. 불필요한 인력과 관리 비용을 줄이고, 효율적인 재고 관리와 AI 기반 예측 기능을 통해 운영 비용을 절감할 수 있습니다.
  
- **안전성**: AI를 활용한 CCTV 이상 감지 시스템과 보안 강화 기능으로 매장의 안전성을 극대화합니다. 실시간으로 이상 상황을 감지하고 즉시 알림을 제공해 불필요한 손실을 방지합니다.

- **예측성**: 과거의 판매 데이터를 분석하여 미래의 수요를 예측합니다. 이를 통해 발주 시기를 최적화하고, 재고 과잉이나 부족을 예방하여 매장 운영을 더 원활하게 합니다.

- **편리성**: PWA 기반으로 사장님이 언제 어디서든 모바일을 통해 재고를 확인하고 매장을 관리할 수 있으며, Kiosk 서비스를 통해 매장을 원격으로 제어할 수 있습니다.

<br>

# 👥 팀 소개

<table align="center">
  <tr>
    <tr align="center">
        <td style="min-width: 250px;">
            <a href="https://github.com/yuseok01">
              <b>김유석</b>
            </a>
        </td>
        <td style="min-width: 250px;">
            <a href="https://github.com/solmysoul1">
              <b>이한솔</b>
            </a> 
        </td>
        <td style="min-width: 250px;">
            <a href="https://github.com/hyeonjong-kim">
              <b>이수완</b>
            </a>
        </td>
    </tr>
    <tr align="center">
        <td style="min-width: 250px;">
              <img src="/READMEfile/yuseok.jpg" width="100">
        </td>
        <td style="min-width: 250px;">
              <img src="/READMEfile/hansol.jpg" width="100">
        </td>
        <td style="min-width: 250px;">
              <img src="/READMEfile/soowan.jpg" width="100">
        </td>
    </tr>
    <tr align="center">
        <td>
        <b>Team Leader<br/> Project Manager</b><b><br/>Frontend<br></b>Kiosk
        </td>
        <td>
        <b>Backend</b><br/>Frontend<br/>웹 사이트 디자인 총괄<br/>User Service 구현<br/>
        </td>
        <td>
        <b>Frontend</b><br/>창고 관리 주요 기능 구현<br/>발표 및 영상<br/>
        </td>
    </tr>
  <tr>
    <tr align="center">
        <td style="min-width: 250px;">
           <a href="https://github.com/seoyoung059">
              <b>김서영</b>
            </a>
        </td>
        <td style="min-width: 250px;">
            <a href="https://github.com/pv104">
              <b>김준혁</b>
            </a>
        </td>
        <td style="min-width: 250px;">
           <a href="https://github.com/whereisawedhii">
              <b>문재성</b>
            </a> 
        </td>
    </tr>
    <tr align="center">
        <td style="min-width: 250px;">
              <img src="/READMEfile/kimseoyung.jpg" width="100">
        </td>
        <td style="min-width: 250px;">
              <img src="/READMEfile/junhyeok.png" width="100">
        </td>
        <td style="min-width: 250px;">
               <img src="/READMEfile/moon.jpg" width="100">
        </td>
    </tr>
    <tr align="center">
        <td>
        <b>Backend Leader, Infra</b><br>CI/CD 및 배포환경 구축<br/>비즈니스 로직 구현<br/>
        백엔드 성능개선 작업<br/>
        </td>
        <td>
        <b>Backend</b><br/>상품 이동<br/>재고 압축<br/>리팩토링 
        </td>
        <td>
        <b>Backend</b><br>상품 입고 및 출고<br/>출고 최적화<br/>백엔드 코드 리팩토링
        </td>
    </tr>
</table>

# ⏱ 개발 기간

- 2024-09-19 ~ 2024-10-10 (8주)
<br>

# 📅 개선 일지

### 2024년 9월 22일
- **JWT AccessToken, RefreshToken 도입 및 Redis 사용**
  - Spring Security 필터를 사용하여 토큰 인증을 수행하고, RefreshToken을 도입하여 Redis로 관리함으로써 보안을 강화.
  - User와 디바이스(키오스크, 카메라) 역할을 분리하여 결제 보안 프로세스를 추가.
  
### 2024년 9월 29일
- **AI 학습 성과 요약**
  - SlowFast 모델: Epoch 1에서 79% 정확도 → Epoch 6에서 92% 도달
  - X3D 모델: Epoch 1에서 81% 정확도 → Epoch 10에서 95% 도달
  - TorchServe 앙상블 서빙으로 AI 모델의 예측 견고성 강화.
  - 부하 테스트: 스레드 50개와 10개 영상 파일 동시 처리, 안정성 검증 완료.

### 2024년 10월 1일
- **api 효율성 증대**
  - 기존에 여러 API 호출이 필요한 동작을 개선하여 한 번의 요청으로 bulk save, update, delete가 가능하도록 구현.
  - 매장 및 매장 구조에서 API 효율성 개선.
  
### 2024년 10월 5일
- **Infra 개선**
  - 블루/그린 무중단 배포를 통해 서비스 중단 없이 배포 과정 진행 가능.
  - Jenkins Pipeline에서 Nginx의 `conf` 파일을 수정하여 트래픽 전환과 충돌 방지를 자동화.
  - 각 서비스(프론트엔드, 백엔드, 머신러닝)의 파이프라인을 도입하여 각각의 빌드 및 배포 과정 자동화.
  - 프론트엔드 빌드 약 7분, 백엔드 및 ML 빌드 약 1분으로 효율적인 배포를 가능하게 함.

<br>

<br>
# 🛠️ 기술 스택

##### 📱 Frontend
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Styled-Components](https://img.shields.io/badge/styled--components-DB7093?logo=styled-components&logoColor=white)

##### 🖥️ Frontend(Kiosk)
![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)

##### 🔗 npm 패키지

![HandsonTable](https://img.shields.io/badge/HandsonTable-FFA500?logo=handsoncode&logoColor=white)
![SheetJS](https://img.shields.io/badge/SheetJS-0072C6?logo=javascript&logoColor=white)
![MUI DataTable](https://img.shields.io/badge/MUI%20DataTable-007FFF?logo=mui&logoColor=white)
![Konva](https://img.shields.io/badge/Konva-FF6347?logo=canvas&logoColor=white)

##### 💻 Backend

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.1-brightgreen?logo=springboot)
![JDK 17](https://img.shields.io/badge/JDK-17-orange?logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-6DB33F?logo=hibernate&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![TorchServe](https://img.shields.io/badge/TorchServe-FB4D3D?logo=pytorch&logoColor=white)

##### 🤖 AI/ML 기술
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![TorchServe](https://img.shields.io/badge/TorchServe-FB4D3D?logo=pytorch&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

##### 🚀 Infra

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-FFA500?logo=jenkins&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?logo=amazon&logoColor=white)
![Amazon RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?logo=amazonrds&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-black?logo=nginx&logoColor=white)

##### ⚙️ Management Tools

![GitLab](https://img.shields.io/badge/GitLab-FCA121?logo=gitlab&logoColor=white)
![JIRA](https://img.shields.io/badge/JIRA-0052CC?logo=jira&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-7289DA?logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?logo=notion&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)
[![Code Style: Google Java Style Guide](https://img.shields.io/badge/Code%20Style-Google--Java--Style--Guide-4285F4?logo=google&logoColor=white)](https://google.github.io/styleguide/javaguide.html)

##### 🖥️ IDE

![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?logo=intellij-idea&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visual-studio-code&logoColor=white)


# 🎋 브랜치 전략
<img src="/READMEfile/Branch strategy.png">

# 📜 커밋 컨벤션
> **태그**: 제목의 형태이며 ':' 뒤에만 space가 있음에 유의한다.
- **`feat`**: 새로운 기능 추가
- **`fix`**: 버그 수정
- **`docs`**: 문서 수정
- **`style`**: 코드 포맷팅, 세미콜론 누락
- **`refactor`**: 코드 리팩토링
- **`test`**: 테스트 코드 작성 및 수정
- **`chore`**: 빌드 업무 수정, 패키지 매니저 수정
<br>

# 📄 프로젝트 구조
<img src="./READMEfile/Structure.png" alt="프로젝트 구조">


<br>

# 🌐 포팅 매뉴얼

[포팅 매뉴얼 보러 가기](https://whereisawedhi.notion.site/Auto-store-6eee2d733145412788c738e4fade9307?pvs=4)
<br>


# 💻 서비스 화면


|                                     |                                      |
|-------------------------------------|--------------------------------------|



<br>

<br>

# 📝 프로젝트 후기

### 김유석


<br>
    
### 김서영


<br>

### 김준혁




<br>

### 문재성


<br>

### 이한솔

<br>

### 이수완
