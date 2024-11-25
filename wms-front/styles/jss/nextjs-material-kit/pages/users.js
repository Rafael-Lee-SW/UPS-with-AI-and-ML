// users.js
import { container } from "/styles/jss/nextjs-material-kit.js";

const componentsStyle = {
  // Default : PC 환경

  // 사이드 바
  sidebar: {
    width: "90px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "white",
    padding: "5px 5px 15px 5px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 1200,
  },
  // 홈버튼
  homeButton: {
    border: "none",
    backgroundColor: "transparent",
    paddingTop: "10px",
    paddingLeft: "20px",
  },
  homeImg: {
    height: "30px",
    width: "60px",
    paddingRight: "15px",
  },
  // 창고 선택 파트
  currentStoreIndex: {
    paddingTop: "25px",
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#459ab6",
  },
  warehouseDropdown: {
    margin: "10px 0",
    paddingBottom: "10px",
  },
  warehouseSelect: {
    width: "100%",
    padding: "5px",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "4px",
    textAlign: "center",
    border: "1px solid black",
    backgroundColor: "transparent",
    cursor: "pointer",
    appearance: "none",
    whiteSpace: "normal",
  },
  warehouseOption: {
    fontSize: "12px",
    fontWeight: "bold",
    lineHeight: "1.2",
    whiteSpace: "normal",
    overflow: "hidden",
    padding: "10px",
  },
  // 각 component로 이동하는 버튼
  buttonStyle: {
    width: "100px",
    color: "black",
    marginLeft: "10px",
    height: "30px",
    borderRadius: "4px",
    "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "white",
        color: "black",
        border: "1px solid #459ab6"
      },
  },
  selectedButton: {
    backgroundColor: "#00B4D8 !important", // Custom color for the selected button
    transform: "scale(1.05)", // Optional effect
  },
  button1: {
    backgroundColor: "#78dfff",
  },
  button2: {
    backgroundColor: "#7faabb",
  },
  button3: {
    backgroundColor: "#b2ddef",
  },
  button4: {
    backgroundColor: "#9baab1",
  },
  mainContent: {
    marginLeft: "90px",
    overflow: "none",
  },

  //Mobile 환경
  "@media (max-width: 960px)": {
    // 사이드 바는 상단바로 바뀌어야 한다.
    sidebar: {
      position: "fixed",
      top: 0,
      backgroundColor: "transparent",
      boxShadow: "none",
      padding: "5px 5px 15px 5px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      zIndex: 1200,
    },
    // 홈버튼
    homeButton: {
      border: "none",
      backgroundColor: "transparent",
      paddingTop: "1px",
      paddingLeft: "5px",
    },
    homeImg: {
      height: "20px",
      width: "40px",
      paddingRight: "10px",
    },
    // 창고 선택 파트
    currentStoreIndex: {
      padding: "1px 10px 0 0",
      fontSize: "12px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#459ab6",
      whiteSpace: "nowrap", // 자동 줄바꿈을 방지한다.
    },
    warehouseDropdown: {
      margin: "1px 5px 0 0",
      paddingBottom: "10px",
    },
    warehouseSelect: {
      width: "80px",
      padding: "5px 5px 0 0",
      fontSize: "12px",
      fontWeight: "bold",
      borderRadius: "4px",
      textAlign: "center",
      border: "1px solid #black",
      backgroundColor: "transparent",
      cursor: "pointer",
      appearance: "none",
      whiteSpace: "normal",
    },
    warehouseOption: {
      fontSize: "12px",
      fontWeight: "bold",
      lineHeight: "1.2",
      whiteSpace: "normal",
      overflow: "hidden",
      padding: "10px",
    },
    // 각 component로 이동하는 버튼
    buttonStyle: {
      fontSize: "10px",
      width: "70px",
      color: "black",
      margin: "1px 0 0 10px",
      padding: "11px",
      height: "12px",
      borderRadius: "4px",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "white",
        color: "black",
        border: "1px solid #459ab6"
      },
    },
    selectedButton: {
      backgroundColor: "#00B4D8 !important", // Custom color for the selected button
      transform: "scale(1.05)", // Optional effect
    },
    button1: {
    backgroundColor: "#78dfff",
  },
  button2: {
    backgroundColor: "#7faabb",
  },
  button3: {
    backgroundColor: "#b2ddef",
  },
  button4: {
    backgroundColor: "#9baab1",
  },
    mainContent: {
      marginLeft: "0px",
      overflow: "none",
    },
  },
};

export default componentsStyle;
