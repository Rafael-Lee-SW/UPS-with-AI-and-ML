// styles\jss\nextjs-material-kit\pages\componentsSections\MyContainerStyle.jsx

import { container, title } from "/styles/jss/nextjs-material-kit.js";
import customCheckboxRadioSwitch from "/styles/jss/nextjs-material-kit/effect/customCheckboxRadioSwitch.js";

const basicsStyle = {
  // 해당 컴포넌트 전역 스타일
  canvasContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },

  // 좌측 사이드바 시작
  leftSidebar: {
    position: "absolute",
    top: "10vh",
    left: 0,
    width: "200px",
    height: "80vh",
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1100,
    padding: "10px 10px 10px 15px",
    overflowY: "auto",
  },
  // 로케이션 생성, 벽 생성 등의 버튼 스타일
  buttonStyle: {
    backgroundColor: "transparent",
    width: "50px",
    color: "#7D4A1A",
    marginLeft: "10px",
    marginTop: "30px",
    height: "30px",
    border: "1px solid #7D4A1A",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#7D4A1A",
      color: "white",
    },
  },
  // 어떤 오브젝트(로케이션, 벽)에 따라 달라지는 상단 글씨
  settingObject: {
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: "10px",
  },
  // 단수와 크기를 정하세요
  settingSizeAndFloor: {
    textAlign: "center",
  },
  showTheFloorLevel: {
    paddingTop: "20px",
    marginLeft: "5px",
    textAlign: "center",
  },
  settingSlider: {
    color: "#4E4544",
    width: "140px", // Set the width of the slider
    margin: "0 auto", // Center the slider
    alignItems: "center", // Centers the content horizontally
  },
  showTheWidthAndHeight: {
    marginLeft: "5px",
  },
  nameTextField: {
    marginTop: "20px",
  },
  generateButton: {
    backgroundColor: "#7D4A1A",
    fontSize: "15px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "transparent",
      border: "1px solid #7D4A1A",
      color: "#7D4A1A",
    },
  },
  // 캔버스 영역
  outOfCanvas: {
    borderRadius: 5,
    width: "100%",
    height: "100vh",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden", // Canvas 영역 이외에는 잠금
  },
  inOfCanvas: {
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
    height: "100vh",
    margin: "2% auto",
    position: "relative",
    overflow: "hidden", // Canvas 영역 이외에는 잠금
    cursor: "default",
  },
  // 캔버스 내의 줌 버튼들 Style
  zoomControler: {
    position: "absolute",
    content: "center",
    left: "45%",
    top: "3rem",
    display: "flex",
    gap: "10px",
  },
  zoomicons: {
    color: "#FFFFFF",
    width: "35px",
    height: "35px",
  },
  // 모바일 시에 나타나는 우측 사이드바 조절 버튼
  toggleSidebarButton: {
    "@media (max-width: 960px)": {
      display: "flex", // Show button only on mobile
    },
    display: "none", // Hide on desktop
  },
  // 우측 사이드바
  rightSidebar: {
    position: "absolute",
    top: "10vh",
    right: 15,
    width: "220px",
    height: "80vh",
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1100,
    padding: "10px 0",
    overflowY: "auto",
  },
  //우측 사이드바의 크기에 따른 설정
  // sidebarVisible: {
  //   transform: "translateX(0)", // fully visible
  // },
  // sidebarHidden: {
  //   transform: "translateX(100%)", // hidden offscreen
  // },
  // 우측 사이드바 내의 재고함 목록
  listOfLocations: {
    width: "100%",
  },
  ulListStyle: {
    height: "30vh",
    overflowY: "auto",
    listStyle: "none",
    padding: 0,
  },
  liListStyle: {
    cursor: "pointer",
    padding: "5px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    transition: "background-color 0.3s", // Smooth transition effect
  },

  //마우스 우클릭 시에 나오는 메뉴
  rightClickMenu: {
    display: "none",
    position: "absolute",
    width: "60px",
    backgroundColor: "white",
    boxShadow: "0 0 5px grey",
    borderRadius: "3px",
  },
  pulse: {
    width: "100%",
    backgroundColor: "white",
    border: "none",
    margin: 0,
    padding: "10px",
  },
  delete: {
    width: "100%",
    backgroundColor: "white",
    border: "none",
    margin: 0,
    padding: "10px",
  },

  //자동으로 상자 생성할 때 필요한 모달과 페이퍼 스타일
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  paper: {
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: "5",
    padding: "20px",
    maxWidth: "500px",
    width: "90%",
    outline: "none",
    borderRadius: "8px",
    margin: "auto",
  },
  // loading 화면 스타일
  loading: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  ...customCheckboxRadioSwitch,

  //Mobile 환경
  "@media (max-width: 960px)": {
    // 해당 컴포넌트 전역 스타일
    canvasContainer: {
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
    },

    // 좌측 사이드바 시작
    leftSidebar: {
      position: "absolute",
      top: "10vh",
      left: 0,
      width: "200px",
      height: "80vh",
      backgroundColor: "rgba(247, 247, 247, 0.9)",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      display: "none", // 안보이게
      flexDirection: "column",
      alignItems: "center",
      zIndex: 1100,
      padding: "10px 10px 10px 15px",
      overflowY: "auto",
    },
    // 로케이션 생성, 벽 생성 등의 버튼 스타일
    buttonStyle: {
      backgroundColor: "transparent",
      width: "50px",
      color: "#7D4A1A",
      marginLeft: "10px",
      marginTop: "30px",
      height: "30px",
      border: "1px solid #7D4A1A",
      borderRadius: "4px",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#7D4A1A",
        color: "white",
      },
    },
    // 어떤 오브젝트(로케이션, 벽)에 따라 달라지는 상단 글씨
    settingObject: {
      textAlign: "center",
      fontWeight: "bold",
      paddingTop: "10px",
    },
    // 단수와 크기를 정하세요
    settingSizeAndFloor: {
      textAlign: "center",
    },
    showTheFloorLevel: {
      paddingTop: "20px",
      marginLeft: "5px",
      textAlign: "center",
    },
    settingSlider: {
      color: "#4E4544",
      width: "140px", // Set the width of the slider
      margin: "0 auto", // Center the slider
      alignItems: "center", // Centers the content horizontally
    },
    showTheWidthAndHeight: {
      marginLeft: "5px",
    },
    nameTextField: {
      marginTop: "20px",
    },
    generateButton: {
      backgroundColor: "#7D4A1A",
      fontSize: "15px",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "transparent",
        border: "1px solid #7D4A1A",
        color: "#7D4A1A",
      },
    },
    // 캔버스 영역
    outOfCanvas: {
      borderRadius: 5,
      width: "100%",
      height: "100vh",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden", // Canvas 영역 이외에는 잠금
    },
    inOfCanvas: {
      backgroundColor: "white",
      borderRadius: 5,
      width: "100%",
      height: "100vh",
      margin: "2% auto",
      position: "relative",
      overflow: "hidden", // Canvas 영역 이외에는 잠금
      cursor: "default",
    },
    //줌 버튼들 Style
    zoomControler: {
      position: "absolute",
      top: "85%",
      right: "0px",
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
    },
    zoomicons: {
      width: "17px",
      height: "17px",
      color: "#FFFFFF",
      width: "35px",
      height: "35px",
    },

    // 우측 사이드바
    rightSidebar: {
      position: "absolute",
      top: "10vh",
      right: 15,
      width: "220px",
      height: "75vh",
      backgroundColor: "rgba(247, 247, 247, 0.9)",
      boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
      display: "flex", // 모바일이니까
      flexDirection: "column",
      alignItems: "center",
      zIndex: 1100,
      padding: "10px 0",
      overflowY: "auto",
      transition: "transform 0.3s ease-in-out", // Smooth slide transition
      transform: "translateX(100%)", // Move out of view initially
    },
    sidebarVisible: {
      // display: "flex !important", // 모바일이니까
      transform: "translateX(0%)", // fully visible
    },
    sidebarHidden: {
      // display: "none !important", // 모바일이니까
      transform: "translateX(100%)", // hidden offscreen
    },
    // 우측 사이드바 내의 재고함 목록
    listOfLocations: {
      width: "100%",
    },
    ulListStyle: {
      height: "30vh",
      overflowY: "auto",
      listStyle: "none",
      padding: 0,
    },
    liListStyle: {
      cursor: "pointer",
      padding: "5px",
      borderBottom: "1px solid #ccc",
      textAlign: "center",
      transition: "background-color 0.3s", // Smooth transition effect
    },

    //마우스 우클릭 시에 나오는 메뉴
    rightClickMenu: {
      display: "none",
      position: "absolute",
      width: "60px",
      backgroundColor: "white",
      boxShadow: "0 0 5px grey",
      borderRadius: "3px",
    },
    pulse: {
      width: "100%",
      backgroundColor: "white",
      border: "none",
      margin: 0,
      padding: "10px",
    },
    delete: {
      width: "100%",
      backgroundColor: "white",
      border: "none",
      margin: 0,
      padding: "10px",
    },

    //자동으로 상자 생성할 때 필요한 모달과 페이퍼 스타일
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    paper: {
      backgroundColor: "white",
      border: "2px solid #000",
      boxShadow: "5",
      padding: "20px",
      maxWidth: "500px",
      width: "90%",
      outline: "none",
      borderRadius: "8px",
      margin: "auto",
    },
    // loading 화면 스타일
    loading: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    },
  },
};

export default basicsStyle;
