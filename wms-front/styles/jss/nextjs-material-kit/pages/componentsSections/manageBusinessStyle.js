const manageBusinessStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center', 
        padding: "10px"
    },
    renderContainer: {
        width: '100%'
    }, 
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: "10px",
        paddingTop: '30px',
        width: '100%'
    },
    div: {
        padding: "10px"
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
    h3: {
        margin: '10px'
    },
    text: {
        paddingRight: '20px',
    },
    table: {
        width: '70%',
        borderCollapse: 'collapse',
        border: '1px solid #ddd',
        '& td': {
            padding: '8px',
            borderBottom: '1px solid #ddd',
        },
        '& tr:not(:last-child) td': {
            borderBottom: '1px solid #ccc',
        },
    },
    input: {
        width: '100%',
    },
    labelCell: {
        backgroundColor: '#f0f0f0',
        textAlign: 'right',
        paddingRight: '10px',
        fontWeight: 'bold',
        width: '30%',
        height: '50px',
    },
    valueCell: {
        paddingLeft: '10px',
        width: '70%',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '70%',
        marginTop: '20px',
    },
    businessTitle: {
        paddingTop: '30px'
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
}

export default manageBusinessStyle;