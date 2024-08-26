const mainEnd = {
    container: {
        height: "50vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
    },
    title: {
        fontSize: "30px",
        fontWeight: "bold",
        color: "#785006",
        paddingBottom: "30px"
    },
    button: {
        width: "200px",
        backgroundColor: '#FFFFFF', 
        color: '#8B4513', 
        padding: '10px 20px',
        border: 'solid 1px #8B4513',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '16px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'background-color 0.3s ease', 
        '&:hover': {
        backgroundColor: '#8B4513', 
        color: '#FFFFFF', 
        }
    },
}

export default mainEnd