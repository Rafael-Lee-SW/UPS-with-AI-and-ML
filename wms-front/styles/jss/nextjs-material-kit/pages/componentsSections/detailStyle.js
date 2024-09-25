const useStyles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
  header: {
    marginBottom: '16px', // theme.spacing(2)를 '16px'로 대체
  },
  subheader: {
    marginBottom: '16px', // theme.spacing(2)를 '16px'로 대체
  },
  divider: {
    width: '60%',
    marginBottom: '32px', // theme.spacing(4)를 '32px'로 대체
    marginTop: '24px', // theme.spacing(3)를 '24px'로 대체
  },
  button: {
    margin: '8px', // theme.spacing(1)를 '8px'로 대체
    width: '300px',
    height: '50px',
    color: '#000',
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  div: {
    padding: '20px'
  },
  box: {
    padding: '10px',
    width: '100px',
    height: '100px',
  },
});

export default useStyles;
