// styles\jss\nextjs-material-kit\pages\componentsSections\MyContainerStyle.jsx

import { container, title } from "/styles/jss/nextjs-material-kit.js";
import customCheckboxRadioSwitch from "/styles/jss/nextjs-material-kit/effect/customCheckboxRadioSwitch.js";

const basicsStyle = {
  sections: {
    padding: "1% 0",
  },
  container,
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between", // Aligns items with space between them
    alignItems: "center", // Aligns items vertically centered
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "flex-end", // Aligns items to the right
    alignItems: "center", // Aligns items vertically centered
  },
  space50: {
    height: "50px",
    display: "block",
  },
  space70: {
    height: "70px",
    display: "block",
  },
  icons: {
    width: "17px",
    height: "17px",
    color: "#FFFFFF",
  },
  mainBody: {
    display: "flex",
    height: "85vh",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },

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
  canvasContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  paper: { // 새로운 창고 생성시 자동으로 상자 생성할 때 필요한 것
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

  ...customCheckboxRadioSwitch,
};

export default basicsStyle;
