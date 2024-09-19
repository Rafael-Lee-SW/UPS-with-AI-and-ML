// users.js
import { container } from "/styles/jss/nextjs-material-kit.js";

const componentsStyle = {
  // i don't know its nessesary for style.
  container,
  link: {
    textDecoration: "none",
  },
  // Styles from [id].jsx
  sidebar: {
    width: "90px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#f7f7f7",
    padding: "5px 5px 15px 5px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 1200,
  },
  button: {
    border: "none",
    backgroundColor: "transparent",
    paddingTop: "10px",
    paddingLeft: "20px",
  },
  currentWarehouseIndex: {
    paddingTop: "25px",
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#7D4A1A",
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
    border: "1px solid #986c58",
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
  buttonStyle: {
    width: "100px",
    color: "white",
    marginLeft: "10px",
    height: "30px",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#7D4A1A",
      color: "white",
    },
  },
  selectedButton: {
    backgroundColor: "#7D4A1A !important" , // Custom color for the selected button
    transform: "scale(1.05)", // Optional effect
  },
  button1:{
    backgroundColor: "#4E4544"
  },
  button2:{
    backgroundColor: "#ADAAA5"
  },
  button3:{
    backgroundColor: "#C2B6A1"
  },
  button4:{
    backgroundColor: "#A99987"
  },
  mainContent: {
    marginLeft: "90px",
    overflow: "none",
  },
  //Mobile 환경
  "@media (max-width: 960px)": {},
};

export default componentsStyle;
