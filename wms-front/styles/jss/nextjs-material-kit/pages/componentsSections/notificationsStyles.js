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
      cursor: "pointer",
      padding: "10px",
      border: "1px solid lightgray",
      borderRadius: "5px",
      border: '1px solid #7D4A1A',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: '#f5f5f5',
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
