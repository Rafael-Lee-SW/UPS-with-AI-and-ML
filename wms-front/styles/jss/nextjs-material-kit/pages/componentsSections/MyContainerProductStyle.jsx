// styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx

import { makeStyles } from "@material-ui/core/styles";

const styles = {
  container: {
    marginBottom: "1%",
    margin: "2%",
  },
  dialogContent: {
    height: 600,
  },
  buttons: {
    marginTop: 20,
  },
  modalHeader: {
    color: "red",
    fontWeight: "bold",
  },
  // Add other styles as needed
};

const useStyles = makeStyles(styles);

export default useStyles;
