// users.js
import { container } from "/styles/jss/nextjs-material-kit.js";

const componentsStyle = {
  container,
  brand: {
    color: "#FFFFFF",
    textAlign: "left",
  },
  title: {
    fontSize: "4.0rem",
    fontWeight: "600",
    display: "inline-block",
    position: "relative",
    color: "yellow",
    textShadow: `
      -2px -2px 0 #000,  
       2px -2px 0 #000,
      -2px  2px 0 #000,
       2px  2px 0 #000
    `,
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "510px",
    margin: "10px 0 0",
    color: "yellow",
    textShadow: `
      -2px -2px 0 #000,  
       2px -2px 0 #000,
      -2px  2px 0 #000,
       2px  2px 0 #000
    `,
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3",
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    "@media (max-width: 830px)": {
      marginLeft: "10px",
      marginRight: "10px",
    },
  },
  link: {
    textDecoration: "none",
  },
  textCenter: {
    textAlign: "center",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
  },
  currentWarehouse: {
    fontSize: "1.8rem",
    fontWeight: "bold",
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
  content: {
    padding: "20px",
  },
  currentWarehouseIndex: {
    paddingTop: "25px",
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#7D4A1A",
  },
  mainContent: {
    marginLeft: "90px",
    overflow: "none",
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
  button: {
    border: "none",
    backgroundColor: "transparent",
    paddingTop: "10px",
    paddingLeft: "20px",
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
};

export default componentsStyle;
