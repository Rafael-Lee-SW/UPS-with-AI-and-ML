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
      display: 'grid',
      gap: '20px',
      justifyContent: 'center',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      margin: '40px',
  },
  card: {
      backgroundColor: "#e6f4fa",
      cursor: "pointer",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: '#e6f4fa',
          border: "1px solid #9baab1",
      },
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
