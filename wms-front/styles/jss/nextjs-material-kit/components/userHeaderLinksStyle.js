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
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '3px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      maxWidth: '320px',
      maxHeight: '70vh',
      left: '50% !important',
      right: 'auto !important',
      transform: 'translateX(-50%)',
    },
  },
  notificationList: {
    padding: "0",
  },
  notificationItem: {
    borderBottom: "1px solid #e0e0e0",
    transition: 'background-color 0.3s',
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.1)",
    },
    padding: '12px 16px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 14px',
    },
  },
  notificationItemRead: {
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f8f8f8",
    transition: 'background-color 0.3s',
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
    padding: '12px 16px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 14px',
    },
  },
  notificationText: {
    fontSize: "14px",
    color: '#333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
    },
  },
  notificationTextTypography: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: '1.4',
  },
  viewAllButton: {
    margin: "12px auto", // 상하 여백은 유지하고 좌우는 auto로 설정하여 중앙 정렬
    display: 'block', // 버튼을 블록 레벨 요소로 변경
    width: 'calc(100% - 24px)', // 전체 너비에서 좌우 마진을 뺀 값
    maxWidth: '250px', // 최대 너비 설정
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '20px',
    padding: '8px 16px',
    transition: 'all 0.3s',
    fontWeight: '500',
    textTransform: 'none',
    textAlign: 'center', // 텍스트 중앙 정렬
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '10px auto',
      fontSize: '13px',
      padding: '6px 12px',
      width: 'calc(100% - 20px)', // 모바일에서 좌우 여백 조정
    },
  },
  notificationHeader: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    fontWeight: '500',
    fontSize: '16px',
    color: '#333',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
});

export default headerLinksStyle;