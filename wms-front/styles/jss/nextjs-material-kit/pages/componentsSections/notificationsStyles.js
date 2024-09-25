import { container, title } from "/styles/jss/nextjs-material-kit.js";

const notificationsStyles = {
  section: {
    backgroundColor: "#FFFFFF",
    display: "block",
    width: "100%",
    position: "relative",
    padding: "0",
  },
  cardContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
      paddingTop: '20px',
  },
  card: {
      cursor: "pointer",
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid lightgray",
      borderRadius: "5px",
      width: '50%',
      border: '1px solid #7D4A1A'
  },
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  modalTitle: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
  },
  modalCloseButton: {
        backgroundColor: "transparent",
        border: "none",
        cursor: 'pointer'
  },
};

export default notificationsStyles;
