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

  leftSideBar: {
    marginLeft: "0",
    padding: "8px",
    border: "2px solid #aaaaaa",
    borderRadius: "14px",
    width: "20%",
    height: "80vh",
    overflowY: "auto",
  },
  buttonStyle: {
    width: "20%",
    fontSize: "14px",
  },
  outOfCanvas: {
    border: "2px solid #aaaaaa",
    backgroundColor: "#aaaaaa",
    borderRadius: 5,
    width: "60%",
    height: "80vh",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden", // Canvas 영역 이외에는 잠금
  },
  inOfCanvas: {
    border: "2px solid #aaaaaa",
    backgroundColor: "white",
    borderRadius: 5,
    width: "95%",
    height: "88%",
    margin: "2% auto",
    position: "relative",
    overflow: "hidden", // Canvas 영역 이외에는 잠금
  },
  rightSideBar: {
    padding: "10px",
    border: "2px solid #aaaaaa",
    borderRadius: "15px",
    width: "18%",
    height: "80vh",
    overflowY: "auto",
  },
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
    outline: "none",
    borderRadius: "8px",
    width: "80%", // Width of the modal content
    maxWidth: "500px", // Ensure the modal does not exceed this width
    margin: "auto",
  },

  ...customCheckboxRadioSwitch,
};

export default basicsStyle;
