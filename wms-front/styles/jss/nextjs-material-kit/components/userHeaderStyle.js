import {
  container,
  hexToRGBAlpha,
  defaultFont,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  roseColor,
  transition,
  boxShadow,
  drawerWidth,
} from "/styles/jss/nextjs-material-kit.js";

const headerStyle = (theme) => ({
  appBar: {
    display: "flex",
    border: "0",
    borderRadius: "3px",
    padding: "0.625rem 0",
    marginBottom: "20px",
    color: "brown",
    width: "100%",
    backgroundColor: "rgba(237, 237, 237, 0.8)",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    transition: "all 150ms ease 0s",
    alignItems: "center",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
    position: "relative",
    zIndex: "unset",
    height: "3rem",
  },
  absolute: {
    position: "absolute",
    zIndex: "1100",
  },
  fixed: {
    position: "fixed",
    zIndex: "1100",
  },
  container: {
    ...container,
    minHeight: "50px",
    flex: "1",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "nowrap",
  },
  flex: {
    flex: 1,
  },
  title: {
    ...defaultFont,
    lineHeight: "30px",
    fontSize: "20px",
    borderRadius: "3px",
    textTransform: "none",
    color: "inherit",
    padding: "8px 16px",
    letterSpacing: "unset",
    "&:hover,&:focus": {
      color: "inherit",
      background: "transparent",
      fontWeight: "bold",
    },
  },
  appResponsive: {
    margin: "20px 10px",
  },
  // 모바일 - 데스크탑을 크기에 따라 구분하기 위함
  hiddenMdUp: {
    [theme.breakpoints.up("md")]: {
      display: "none !important",
    },
  },
  hiddenSmDown: {
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  primary: {
    backgroundColor: primaryColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      primaryColor,
      0.46
    )}`,
  },
  info: {
    backgroundColor: infoColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      infoColor,
      0.46
    )}`,
  },
  success: {
    backgroundColor: successColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      successColor,
      0.46
    )}`,
  },
  warning: {
    backgroundColor: warningColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      warningColor,
      0.46
    )}`,
  },
  danger: {
    backgroundColor: dangerColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      dangerColor,
      0.46
    )}`,
  },
  rose: {
    backgroundColor: roseColor,
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    boxShadow: `0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px ${hexToRGBAlpha(
      roseColor,
      0.46
    )}`,
  },
  transparent: {
    backgroundColor: "transparent !important",
    boxShadow: "none",
    paddingTop: "25px",
    color: "#FFFFFF",
  },
  dark: {
    color: "#FFFFFF",
    // backgroundColor: "#fff",
    backgroundColor: "#212121 !important",
    boxShadow:
      "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(33, 33, 33, 0.46)",
  },
  white: {
    border: "0",
    padding: "0.625rem 0",
    marginBottom: "20px",
    color: "#555",
    backgroundColor: "#fff !important",
    boxShadow:
      "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
  },
  transparentWhite: {
    border: "0",
    padding: "0.625rem 0",
    marginBottom: "20px",
    color: "#555",
    backgroundColor: "rgba(237, 237, 237, 0.8) !important",
    boxShadow:
      "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
  },
  drawerPaper: {
    border: "none",
    bottom: "0",
    transitionProperty: "top, bottom, width",
    transitionDuration: ".2s, .2s, .35s",
    transitionTimingFunction: "linear, linear, ease",
    width: drawerWidth,
    ...boxShadow,
    position: "fixed",
    display: "block",
    top: "0",
    height: "100vh",
    right: "0",
    left: "auto",
    visibility: "visible",
    overflowY: "visible",
    borderTop: "none",
    textAlign: "left",
    paddingRight: "0px",
    paddingLeft: "0",
    ...transition,
  },

  // Media query for mobile view
  "@media (max-width: 960px)": {
    appBar: {
      padding: "0.3rem 0", // Smaller padding for mobile
      height : "2rem",
      maxHeight: "40px", // Reduce the header height for mobile
    },
    container: {
      maxHeight: "40px", // Reduce the container height in mobile
      padding: "0 20px", // Smaller padding for mobile
    },
    title: {
      fontSize: "16px", // Smaller font size for the brand title on mobile
      lineHeight: "20px", // Adjust line height for mobile
    },
    drawerPaper: {
      width: "240px", // Reduce the drawer width on mobile
    },
    notificationBell: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1200,
    },
  },
});

export default headerStyle;
