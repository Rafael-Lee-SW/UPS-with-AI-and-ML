const infoStyle = {
    container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center', 
    padding: "10px",
    paddingTop: '30px'
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
  labelCell: {
    backgroundColor: '#f0f0f0',
    textAlign: 'right',
    paddingRight: '10px',
    fontWeight: 'bold',
    width: '30%',
    height: '50px'
  },
  text: {
    paddingRight: '20px'
  },
  valueCell: {
    paddingLeft: '10px',
    width: '70%'
  },
  button: {
    margin: "10px",
    backgroundColor: "lightgray",
    height: "30px"
}
}

export default infoStyle;