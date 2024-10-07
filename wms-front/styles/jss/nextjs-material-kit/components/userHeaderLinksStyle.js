import { defaultFont } from "/styles/jss/nextjs-material-kit.js";

import tooltip from "/styles/jss/nextjs-material-kit/effect/tooltipsStyle.js";

const headerLinksStyle = (theme) => ({
  list: {
    ...defaultFont,
    fontSize: "14px",
    margin: 0,
    paddingLeft: "0",
    listStyle: "none",
    paddingTop: "0",
    paddingBottom: "0",
    color: "inherit"
  },
  listItem: {
    float: "left",
    color: "inherit",
    position: "relative",
    display: "block",
    width: "auto",
    margin: "0",
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "&:after": {
        width: "calc(100% - 30px)",
        content: '""',
        display: "block",
        height: "1px",
        marginLeft: "15px",
        backgroundColor: "#e5e5e5"
      }
    }
  },
  listItemText: {
    padding: "0 !important"
  },
  navLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)"
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start"
      }
    }
  },
  notificationNavLink: {
    [theme.breakpoints.down("md")]: {
      top: "0",
      margin: "5px 15px"
    },
    color: "#FFF",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    top: "4px"
  },
  registerNavLink: {
    [theme.breakpoints.down("md")]: {
      top: "0",
      margin: "5px 15px"
    },
    top: "3px",
    position: "relative",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex"
  },
  navLinkActive: {
    color: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  },
  icons: {
    width: "20px",
    height: "20px",
    marginRight: "3px"
  },
  socialIcons: {
    position: "relative",
    fontSize: "20px !important",
    marginRight: "4px"
  },
  dropdownLink: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "block",
      padding: "10px 20px"
    }
  },
  ...tooltip,
  marginRight5: {
    marginRight: "5px"
  },
  notificationBell: {
    padding: '8px',
    marginTop: '10px', // 아이콘을 아래로 내리기 위해 추가
    [theme.breakpoints.down('sm')]: {
      padding: '4px',
      marginTop: '0', // 모바일에서는 원래 위치 유지
    },
  },
  notificationIcon: {
    fontSize: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
  },
  notificationBadge: {
    fontSize: '0.8rem',
    height: '18px',
    minWidth: '18px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
      height: '16px',
      minWidth: '16px',
    },
  },
  notificationPopover: {
    width: '300px',
    maxHeight: '400px',
    overflowY: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    [theme.breakpoints.down('sm')]: {
      width: '90%', // 모바일에서 너비를 90%로 설정
      maxHeight: '250px', // 모바일에서 최대 높이를 줄임
      left: '5% !important',
      right: '5% !important',
      borderRadius: '8px',
    },
  },
  notificationList: {
    padding: "0",
  },
  notificationItem: {
    borderBottom: "1px solid #e0e0e0",
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
  notificationItemRead: {
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
  notificationText: {
    fontSize: "14px",
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px', // 모바일에서 텍스트 크기를 줄임
    },
  },
  notificationTextTypography: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px', // 모바일에서 텍스트 크기를 줄임
    },
  },
  viewAllButton: {
    margin: "10px",
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      margin: '5px',
      fontSize: '12px', // 모바일에서 버튼 텍스트 크기를 줄임
    },
  }
});

export default headerLinksStyle;
