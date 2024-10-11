#  Auto Store Project : 무인 매장 관리 시스템

<img src="/READMEfile/unmanndestore.jpg" alt="AUTOSTORE Image" width="1000">


# 목차
- [📌 프로젝트 소개](#-auto-store-프로젝트-소개)
- [🤖 AI 기술](#-ai-기술)
- [🔧 AI 외 기능](#-ai-외-기능)
- [💎 AUTO STORE의 가치](#auto-store의-가치)
- [👥 팀 소개](#-팀-소개)
- [⏱ 개발 기간](#-개발-기간)
- [📅 개선 일지](#-개선-일지)
- [🛠️ 기술 스택](#-기술-스택)
- [🎋 브랜치 전략](#-브랜치-전략)
- [📜 커밋 컨벤션](#-커밋-컨벤션)
- [📄 프로젝트 구조](#-프로젝트-구조)
- [🌐 포팅 매뉴얼](#-포팅-매뉴얼)
- [💻 서비스 화면](#-서비스-화면)
- [📝 프로젝트 후기](#-프로젝트-후기)

<br>

- 배포 URL :http://j11a302.p.ssafy.io/
- Test ID : test@naver.com
- Test PW : asdfasdf12

<br>

## 주요 요소

### 📷 AI 매장 이상 감지(도난, 파손, 실신, 방화, 흡연)

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
- **실시간 처리**: CCTV 및 판매 데이터를 실시간으로 분석하여 즉각적인 대응이 가능합니다.
- **예측성**: 판매 데이터의 예측을 통해 재고 관리 및 발주 주기를 최적화하여 비용을 절감할 수 있습니다.
- **확장 가능성**: TorchServe 및 FastAPI 기반의 AI 시스템으로, 다른 매장 데이터에도 적용 가능하며 모델 확장이 용이합니다.

# 🔧 AI 외 기능

### 🖥️ Kiosk 서비스
- exe 파일로 매장의 키오스크를 관리 할 수 있습니다.
- OTP와 JWT 토큰을 활용하여 매장의 보안을 강화합니다.


### 📋 재고 관리
- PWA를 활용하여 사장님은 모바일 폰으로 언제든지 매장의 재고 수량을 확인 할 수 있습니다.
- 선반의 재고가 부족한 것을 실시간으로 확인 가능합니다.

# 💎 AUTO STORE의 가치

- **저비용**: 최소한의 비용으로 무인 매장을 관리합니다. 불필요한 인력과 관리 비용을 줄이고, 효율적인 재고 관리와 AI 기반 예측 기능을 통해 운영 비용을 절감할 수 있습니다.

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
            <a href="https://github.com/Rafael-Lee-SW">
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
        <b>Team Leader</b><b><br/>Frontend<br></b>Kiosk
        </td>
        <td>
        <b>Backend</b><br/> <b>Frontend</b><br/>웹 사이트 디자인 총괄<br/>User Service 구현<br/>
        </td>
        <td>
        <b>Frontend </b><br/> <b>Project Manager </b><br/>ML 모델 학습 및 배포<br/>웹앱 구축 및 UX/UI 구현 및 개선 <br/>발표 및 영상<br/>
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
              <img src="/READMEfile/seoyoung.jpg" width="100">
        </td>
        <td style="min-width: 250px;">
              <img src="/READMEfile/junhyeok.jpg" width="100">
        </td>
        <td style="min-width: 250px;">
               <img src="/READMEfile/moon.jpg" width="100">
        </td>
    </tr>
    <tr align="center">
        <td>
        <b>Backend Leader </b><br/><b>Infra </b><br/>CI/CD 및 배포환경 구축<br/>비즈니스 로직 구현<br/>
        백엔드 성능개선 작업<br/>
        </td>
        <td>
        <b>Backend</b><br/><b>Infra </b><br/> CI/CD 및 배포환경 구축<br/>비즈니스 로직 구현<br/> 방범 동영상 처리<br/>
        </td>
        <td>
        <b>AI Leader</b><br/><b>Frontend </b><br/>AI 모델 학습, 검증, 배포 및 최적화<br/> 방범 영상 페이지 및 알람 기능 구현<br/>
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

  ### 2024년 9월 25일
- **JSX에서 TSX로 전환 및 호환성 향상**
  - TypeScript 도입을 통해 PC/SC, Electron, Next.js 간의 호환성이 크게 향상됨.
  - 타입 안정성이 강화되어 PC/SC 리더기와의 데이터 처리 시 명확한 타입 정의로 인한 오류 발생이 줄어듦.
  - Electron과 Next.js 간의 상호작용에서 정적 타입 검사로 런타임 오류를 사전에 방지하고, 코드의 유지보수성이 향상됨.
  - 모듈 간 의존성 관리가 명확해져, 각 기술 스택이 안정적으로 상호작용하며, 데이터 교환 및 통신이 원활해짐.
  - 자동 완성과 코드 탐색 기능 덕분에 PC/SC, Electron, Next.js 사이의 복잡한 데이터 흐름을 쉽게 파악하고 관리할 수 있었으며, 이로 인해 코드 품질과 개발 생산성이 개선됨.

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

### 2024년 10월 7일
- **키오스크 API 호출 최적화 (4개 → 2개로 축소)**
  - API 호출 수 감소: 기존에 4개의 API 호출을 통해 처리하던 키오스크 로그인 및 정보 수집 과정을 OTP를 사용하여 2개 API로 축소함. 이로 인해 로그인 시 필요한 정보를 한 번에 받아서, 이후 사용자가 키오스크를 사용하는 동안 추가적인 서버 호출이 필요 없도록 개선됨.
  - 사용성 개선: OTP 로그인 이후 고객이 키오스크를 사용하는 동안 서버 호출이 없어졌으며, 이를 통해 키오스크 응답 속도가 크게 향상됨.
    - 기존: 평균 150ms의 API 응답 시간이 4번 호출 → 총 600ms 소요
    - 개선 후: 평균 200ms의 API 응답 시간이 2번 호출 → 총 400ms로 약 33%의 성능 향상을 이룸.
  - 결과: API 호출 최적화로 키오스크 사용 중 서버와의 불필요한 통신을 제거하여, 고객 경험을 개선하고 서버 부하를 줄임.
### 2024년 10월 9일
- **AI 학습 정확도 개선**
  - SlowFast 모델은 Epoch 1에서 79% 정확도로 시작하여 Epoch 6에서 92% 정확도에 도달 
  - X3D 모델은 Epoch 1에서 81%에서 시작하여 Epoch 10에서 95%의 정확도를 기록        
- **서빙**:  
    - AI 모델의 편향성을 피하고 예측 견고성을 높이기 위해 디폴트 핸들러에서 커스텀 핸들러를 적용한 TorchServe 앙상블 서빙 
    - 두 모델의 검증 정확도 별 앙상블 가중치 조정으로 추론 결과의 견고성을 높임
    - 부하 테스트: 스레드 50개와 10개 영상 파일을 동시에 처리하며 추론 서버의 안정성과 성능 검증

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
#### 커밋 유형은 깃모지와 영어 대문자로 작성하기

| 이모지 | 제목       | 내용                                            |
|--------|------------|-------------------------------------------------|
| ✨     | Feat       | 새로운 기능 추가                               |
| 🐛     | Fix        | 버그 수정                                      |
| 📝     | Docs       | 문서 수정                                      |
| 💄     | Style      | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| ♻️     | Refactor   | 코드 리팩토링                                  |
| ✅     | Test       | 테스트 코드, 리팩토링 테스트 코드 추가       |
| 🙈     | Chore      | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
| 📱     | Design     | CSS 등 사용자 UI 디자인 변경                   |
| 💡     | Comment    | 필요한 주석 추가 및 변경                      |
| 🚚     | Rename     | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우 |
| 🔥     | Remove     | 파일을 삭제하는 작업만 수행한 경우            |
| 🚑️     | !HOTFIX    | 급하게 치명적인 버그를 고쳐야 하는 경우       |
| 🔧     | Config     | 프로젝트 공통 설정 추가                        |

<br>

# 📄 프로젝트 구조
<img src="./READMEfile/Structure.png" alt="프로젝트 구조">


<br>

# 🌐 포팅 매뉴얼

[포팅 매뉴얼 보러 가기](https://whereisawedhi.notion.site/Auto-store-6eee2d733145412788c738e4fade9307?pvs=4)
<br>

# 💻 서비스 화면

### Kiosk

| ![Kiosk 1](./READMEfile/kiosk1.png)| ![Kiosk 2](./READMEfile/kiosk2.png)|
|------------------------------------|------------------------------------|
| **키 입력(로그인)**                  |  **메인 화면**                      |
| ![Kiosk 3](./READMEfile/kiosk3.png)| ![Kiosk 4](./READMEfile/kiosk4.png)|
| **장바구니**                        | **결제**                            |
| ![Kiosk 5](./READMEfile/kiosk5.png)|                                    |
| **결제 완료**                       |                                    |

### Page
| ![Page 1](./READMEfile/page1.png)  | ![Page 2](./READMEfile/page2.png)  |
|:----------------------------------:|:----------------------------------:|
| **방범 영상**                       |   **방범 영상 재생**                 |
| ![Page 3](./READMEfile/page3.png)  | ![Page 4](./READMEfile/page4.png)  |
| **매장 기기 관리**                   |  **매장 재고 분석**                 |
| ![Page 5](./READMEfile/page5.png)  | ![Page 6](./READMEfile/page6.png)  |
| **수요 예측**                       | **수요 예측 시각화**                 |



<br>

<br>

# 📝 프로젝트 후기

### 김유석
이번 프로젝트에서 저는 키오스크 파트를 담당하며 불필요한 서버 비용을 줄이기 위해 Electron을 채택하였습니다. Electron을 활용하여 키오스크가 독립적인 실행 파일 형태로 동작하도록 설계함으로써, 클라우드 서버 비용을 최소화할 수 있었습니다. 특히, 서버와의 불필요한 통신을 줄이는 데 중점을 두어 API 호출 수를 최적화하였으며, 이는 응답 속도를 크게 향상시켰습니다. 예를 들어, 기존에는 로그인을 포함해 4번의 서버 호출이 필요했던 과정을 OTP 인증을 통해 2번의 호출로 줄여 사용자 경험을 개선했습니다.

또한, TypeScript로 전환하면서 Electron과 Next.js 간의 상호작용을 더욱 안정적으로 만들었고, 정적 타입 검사 덕분에 오류를 사전에 방지할 수 있었습니다. TSX를 통해 코드의 유지 보수성도 높였으며, PC/SC 리더기와의 데이터 처리 작업 역시 안정적으로 수행할 수 있었습니다. 7주간의 프로젝트를 통해 성능 최적화와 비용 절감을 동시에 이루어낸 의미 있는 시간이었으며, 함께한 팀원들과의 협업 덕분에 성공적으로 마무리할 수 있었습니다. 감사합니다. 8주간 고생 많이 하신 팀원분들께 너무 감사드립니다.

<br>

### 김서영
이번 프로젝트를 진행하면서 서로 다른 부분을 맡아 서로에게 설명하고 학습한 공유하는 시간을 많이 갖게 되었는데, 저 혼자서는 생각하지 못했을 방향성이나 기술에 대해서 알아보고 얕게나마 이해할 수 있었던 뜻깊은 경험이였습니다. 특히 인프라 부분을 처음 수행하면서 스스로 학습하고 적용해보며 스스로 뿌듯함을 느낄 수 있었습니다. 8주간 고생 많이 하신 팀원분들께 너무 감사드립니다.


<br>

### 김준혁
좋은 팀원들과 함께하면서 JPA와 인프라에 대한 경험을 쌓고, 개발자로서 한 단계 성장하는 뜻깊은 시간이었습니다. 
인프라 구축과 CI/CD 자동화는 처음이었는데, 이번 경험을 통해 리눅스에 대한 지식과 인프라 기술에 대해 학습할 수 있었습니다. 또한 같은 기능을 수행하는 코드를 여러 형태로 구현해보고 다른 팀원들의 코드를 비교하며 좋은 코드의 의미를 다시 한 번 되새기는 프로젝트가 되었습니다.
7주간 함께 열심히 노력해주신 팀원분들께 진심으로 감사드립니다.

<br>

### 문재성
제대로 된 첫 AI 프로젝트 였는데 그래도 함께 달리며 유의미한 결과를 만들어 낸 것 같아 뿌듯합니다.
시행착오가 많았지만 결국에는 모두 해결을 한 경험이 너무 후련했습니다.
다음에는 지식 증류 기법을 통한 온디바이스 AI 구현을 위해 달려보겠습니다.
제가 AI를 맡는 동안 서비스 구현에 고생한 팀원분들께 감사드립니다.


<br>

### 이한솔
spring boot를 사용해 유저 CRUD를 구현해보면서 spring boot의 프로젝트 구조와 흐름에 대해 이해할 수 있었습니다.
accessToken과 refreshToken을 사용한 로그인 방식을 사용해보며 redis를 거쳐 보안을 강화하는 방식에 대해 배울 수 있었습니다.
next.js를 사용한 프론트엔드 파트에서는 코드를 분리하여 재사용성과 업무 효율을 높이는 것에 중점을 두어 더 나은 코드를 만드는 방법을 익힐 수 있었습니다.
spring boot를 처음 사용해봐서 미숙한 부분이 많았는데 팀원들 덕분에 많이 배울 수 있었습니다.  발전적인 결과물을 만들어내는 데 있어 한 뜻을 가지고 자주 소통했던 팀원들의 공이 컸다고 생각합니다.
맡은 역할에 최선을 다해주신 팀원분들께 감사드립니다. 
<br>

### 이수완
 Machine Learning을 통해 시계열 데이터를 예측하는 방법을 학습하고 탐구하는 과정을 통해서 ML, DL, LLM 등이 각각 어떤 상황에 적합하고, 우리 프로젝트에 ML이 어떻게 활용되어야 할지 고찰을 많이 한 프로젝트였습니다. 궁극적으로 End User가 ML과 AI를 통해 추출한 데이터를 유의미하게 받아들이게끔하는 것이 가장 어려운 부분이었습니다.
 Frontend 차원에서는 단순한 구현을 넘어서 이제는 최소한의 DB 호출, 쿠키 서버 활용에 대한 고민, API 통신 방식 변경, Components를 더 세밀하게 분리함으로서 사용성 증가 등을 했고, 이를 통해서 UX를 신경쓰는 동시에 User를 통해 발생하는 비용적 부분 최소화를 많이 고민했고, 지난 프로젝트보다 불필요한 호출을 50% 가량 줄이는 성과를 얻었습니다.(SSR을 적절히 사용해, 많은 데이터 호출의 경우 선재적 처리, 전부다 불러오는 방식의 API 호출이 아닌 유저의 각 움직임마다 API 송신으로 데이터 호출)
 이 모든 것이 가능했던 점은 합이 잘 맞는 팀과 팀원들이 맞은 바의 역할을 잘 수행해주었기에 ,가능했던 것 같습니다. 감사합니다.

