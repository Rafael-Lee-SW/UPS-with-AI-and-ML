import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../context/AuthContext';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Cookie에 저장하기 위해서

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  card: {
    border: "1px solid #459ab6", 
    maxWidth: '350px',
    marginLeft: '60px'
  },
  logo: {
    cursor: 'pointer',
    width: '100%',
    height: '200px',
    marginBottom: '8px',
  },
  snsButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    '& button': {
      margin: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '& img': {
      width: '50px',
      height: '50px',
    },
  },
  textField: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#459ab6',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#459ab6',
    },
  },
  button: {
    border: '1px solid #ccc',
    margin: '8px',
    width: '100px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    width: '100%',
    margin: 0
  },
  divider: {
    height: '1px',
    width: '100px',
    backgroundColor: '#459ab6',
    margin: 0
  },
  dividerText: {
    fontSize: '12px',
    margin: 0,
    padding: '0 10px'
  },
  snsText: {
    margin: '8px 16px',
    fontSize: "22px",
    fontWeight: 'bold'
  },
  title: {
    marginBottom: '32px',
  },
  form: {
    marginTop: '20px'
  },
  signUpContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10px'
  },
  signUpText: {
    fontSize: '12px',
    margin: '0',
    padding: '0 5px'
  },
}));

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const notify = (message) => toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://j11a302.p.ssafy.io/api/auths/sign-in', {
        'email' : email,
        'password' : password,
      });


      if (response.status === 200) {
        const token = response.data.result.accessToken;
        const user = response.data.result.userResponse;

        Cookies.set('token', token, { expires: 1 }); // 쿠키에 저장한다.(하루 짜리)
        login(user, token); // Save user and token in auth state
        notify(`${user.userName}님 환영합니다!`);
        router.push('/'); 
      }
    } catch (error) {
      if (error.response) {
        if (error.response.httpStatus === 400 && error.response.data.statusCode === 4000) {
          notify('로그인에 실패하였습니다. 입력한 정보를 확인하세요.');
        } else if (error.response.httpStatus === 401 && error.response.data.code === 4000) {
          notify('로그인 정보가 맞지 않습니다. 다시 시도해주세요.');
        } else if (error.response.httpStatus === 500 && error.response.data.code === 'DBE') {
          notify('서버가 불안정합니다. 잠시 후 다시 시도해주세요.');
        } else {
          notify('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
      } else {
        notify('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
      }
      
    }
  };

  const signInWithProvider = (provider) => {
    const urls = {
      kakao: 'https://j11a302.p.ssafy.io/api/oauth2/authorization/kakao',
      naver: 'https://j11a302.p.ssafy.io/api/oauth2/authorization/naver',
    };
    window.location.href = urls[provider];
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <div>
              <img
                src="/img/loginLogo.png"
                alt="Logo"
                className={classes.logo}
                onClick={() => router.push('/')}
              />
            </div>
            <CardBody>
              <div className={classes.dividerContainer}>
                <h3 className={classes.snsText}>
                  로그인
                </h3>
              </div>
              <form onSubmit={handleLogin} className={classes.form}>
                <TextField
                  label="이메일주소"
                  type="email"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="비밀번호"
                  type="password"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div>
                  <Button type="submit" variant="contained" style={{ backgroundColor: "#e6f4fa", color: "black" }} className={classes.button}>
                    로그인
                  </Button>
                </div>
              </form>
              <div className={classes.signUpContainer}>
                <p className={classes.signUpText}>Auto-Store가 처음이신가요?</p>
                <a className={classes.signUpText} href="/signup">회원가입</a>
              </div>
            </CardBody>
          </Card>
      </GridItem>
    </GridContainer>
  );
}
