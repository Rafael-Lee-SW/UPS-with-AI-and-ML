// styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx

import { makeStyles } from "@material-ui/core/styles";

const styles = {
  productContainer: {
    marginTop: "3rem",
    display: "flex",
  },
  //좌측 사이드바(left sidebar)
  leftsidebar: {
    position: "absolute",
    width: "200px",
    height: "80vh",
    marginRight: "5px",
    padding: "15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f7f7f7", // Soft background color
    borderRadius: "8px", // Rounded corners
    top: "10vh", // Slight padding from the top of the viewport
    left: "90px", // Align it to the left of the viewport
    overflowY: "auto", // Enable scrolling for overflow content
    zIndex: 1000, // Ensure it stays above other content
  },
  buttonContainer: {
    marginBottom: "10px",
    marginTop: "10vh",
    textAlign: "center",
  },

  //여기까지 작업함.


  buttonStyle: {
    backgroundColor: "#C2B6A1",
    width: "100px",
    color: "white ",
    marginTop: "5px",
    height: "55px",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#C2B6A1",
      color: "white",
    },
  },
};

const useStyles = makeStyles(styles);

export default useStyles;
