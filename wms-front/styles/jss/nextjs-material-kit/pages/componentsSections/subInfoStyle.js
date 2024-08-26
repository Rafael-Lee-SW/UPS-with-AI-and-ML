// SubInfoStyle.js

const subInfoStyle = {
    container: {
      paddingTop: '20px',
      textAlign: "center",
    },
    cardContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      paddingTop: '20px'
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
    button: {        
        backgroundColor: "#7D4A1A",
        width: '100px',
        color: 'white',
        marginLeft: '10px',
        height: "30px",
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
    title: {
      marginBottom: "20px",
      margin: 0
    },
    loadingText: {
      fontSize: "18px",
      color: "gray",
    },
    contentText: {
      marginBottom: "10px",
      fontSize: "18px",
      fontWeight: 'bold'
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: '20px',
      alignItems: 'center',
      paddingBottom: '20px'
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
  
  export default subInfoStyle;
  