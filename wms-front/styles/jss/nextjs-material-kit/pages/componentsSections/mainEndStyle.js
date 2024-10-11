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
        color: "#459ab6",
        paddingBottom: "30px"
    },
    button: {
        width: "200px",
        backgroundColor: '#e6f4fa', 
        color: 'black', 
        padding: '10px 20px',
        border: 'solid 1px #ccc',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '16px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'background-color 0.3s ease', 
        '&:hover': {
            transform: 'scale(1.05)',
            color: 'black',
            border: "1px solid #9baab1"

        }
    },
}

export default mainEnd