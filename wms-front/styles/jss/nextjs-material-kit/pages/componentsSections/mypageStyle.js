const mypageStyle = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '50px',
    paddingTop: '70px',
    backgroundColor: '#D3C7B5', 
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPanel: {
    marginTop: '64px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
    flex: '8', 
    backgroundColor: '#ffffff',
    textAlign: 'center',
    overflow: 'auto'
  },
  divContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  h2: {
    marginRight: '50px',
    marginTop: '30px',
    marginBottom: '30px'
  },
  divHr: {
    width: '90%',
    borderTop: '1px solid #000',
    marginTop: '14px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: '10px'
  },
  rendering: {
    width: '100%',
    top: '20px',
    left: '0',
  }
};

export default mypageStyle;