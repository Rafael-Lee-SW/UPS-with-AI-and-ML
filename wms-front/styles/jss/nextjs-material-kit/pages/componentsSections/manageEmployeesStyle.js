const manageEmployeesStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center', 
    },
    searchContainer: {
        marginTop: '30px',
    },
    resultContainer: {
        paddingTop: '30px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',     
        padding: '10px',
    },
    div: {
        padding: "10px"
    },
    button: {
        margin: "10px",
        backgroundColor: "lightgray",
        height: "30px",
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
    Button: {
        margin: '10px',
        backgroundColor: "transparent",
        width: '50px',
        color: 'black',
        height: "30px",
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
    modalCloseButton: {
        backgroundColor: "transparent",
        border: "none",
        cursor: 'pointer'
    },
    card: {
        width: '30%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    listTitle: {
        paddingTop: '30px',
        fontWeight: 'bold'
    },
    listContainer: {
        width: '30%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    listCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: '10px',
        marginTop: '10px',
        width: '100%',
        border: 'solid 1px #7D4A1A',
        justifyContent: 'space-between'
    },
    nameDiv: {
        margin: '10px',
        marginLeft: '20px'
    },
    email: {
        flexGrow: 1, 
    },
    searchButton: {
        padding: 0,
        paddingBottom: '6px'
    },
    button: {        
        backgroundColor: "#7D4A1A",
        width: '100px',
        color: 'white',
        height: "30px",
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
    modalTitle: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
}
export default manageEmployeesStyle;