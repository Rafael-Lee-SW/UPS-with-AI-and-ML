import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';
import { handleResponse } from '../utils/responseHandler';

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
    border: "1px solid #7D4A1A",
    maxWidth: '400px',
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
    justifyContent: 'center',
    marginBottom: '16px',
    '& button': {
      margin: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    '& img': {
      width: '50px',
      height: '50px',
    },
  },
  textField: {
    margin: '8px',
    minWidth: '100px',
    flex: 1,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7d4a1a', 
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7d4a1a', 
    },
  },
  button: {
    margin: '8px',
    height: '56px',
  },
  buttonSmall: {
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
    backgroundColor: '#7d4a1a',
    margin: 0
  },
  dividerText: {
    fontSize: '12px',
    margin: 0,
    padding: '0 10px'
  },
  snsText: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  title: {
    marginBottom: '32px',
  },
  backButton: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
  signUpTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px'
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10px',
    paddingTop: '20px'
  },
  loginText: {
    fontSize: '13px',
    margin: '0',
    padding: '0 5px'
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [certificationButtonLabel, setCertificationButtonLabel] = useState('인증 확인');
  const [certificationMessage, setCertificationMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isCertificationButtonEnabled, setIsCertificationButtonEnabled] = useState(false);
  const [isCertificationSuccess, setIsCertificationSuccess] = useState(false);

  const notify = (message) => toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  useEffect(() => {
    const validatePassword = (password) => {
      const lengthCheck1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password);
      const lengthCheck2 = /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[\w!@#$%^&*]{10,}$/.test(password);

      return lengthCheck1 || lengthCheck2;
    };

    const timerId = setTimeout(() => {
      if (password) {
        const isValidPassword = validatePassword(password);
        const isPasswordMatch = password === passwordCheck;

        if (isValidPassword && isPasswordMatch) {
          setPasswordMessage('비밀번호가 유효합니다.');
        } else if (!isValidPassword) {
          setPasswordMessage(
            '비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상 또는 3종류 이상을 조합하여 최소 8자리 이상이어야 합니다.'
          );
        } else if (!isPasswordMatch) {
          setPasswordMessage('비밀번호가 일치하지 않습니다.');
        }

        setShowPasswordMessage(true);
        setIsFormValid(isValidPassword && isPasswordMatch);
      } else {
        setShowPasswordMessage(false);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [password, passwordCheck]);

  useEffect(() => {
    if (timer > 0 && isCertificationButtonEnabled) {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timer, isCertificationButtonEnabled]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/email-check', { email });
      
      if (response.data.code === 'SU') { 
        setEmailCheckMessage('사용 가능한 이메일입니다.');
        setIsEmailValid(true);
      } else {
        setEmailCheckMessage(response.data.message);
        setIsEmailValid(false);
      }
    } catch (error) {
      setEmailCheckMessage('중복된 이메일입니다.');
      setIsEmailValid(false);
    }
  };

  const handleSendCertificationEmail = async () => {
    if (isEmailValid) {
      try {
        const certificationResponse = await axios.post('https://i11a508.p.ssafy.io/api/oauth/email-certification', { email });
        
        if (certificationResponse.data.code === 'SU') {
          setCertificationMessage('인증번호 발송에 성공하였습니다.');
          setIsCertificationButtonEnabled(true);
          setTimer(180); 
        } else {
          setCertificationMessage('메일 전송에 실패했습니다.');
        }
      } catch (error) {
        setCertificationMessage('네트워크 오류가 발생했습니다.');
      }
    } else {
      setCertificationMessage('이메일을 먼저 인증해 주세요.');
    }
  };

  const handleCertification = async () => {
    if (isCertificationButtonEnabled) {
      try {
        const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/check-certification', {
          email,
          certificationNumber,
        });
        const { code } = response.data;

        if (code === 'SU') {
          setCertificationMessage('이메일이 인증되었습니다.');
          setIsCertificationButtonEnabled(false);
          setIsCertificationSuccess(true);
          setTimer(0); 
        } else {
          setCertificationMessage('인증번호가 일치하지 않습니다.');
          setIsCertificationSuccess(false);
        }
      } catch (error) {
        setCertificationMessage('네트워크 오류가 발생했습니다.');
        setIsCertificationSuccess(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && isEmailValid) {
      try {
        const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/sign-up', {
          email,
          password,
          certificationNumber,
          name,
          nickname,
        });
        const { message, isSuccess } = handleResponse(response);

        toast[isSuccess ? 'success' : 'error'](isSuccess ? '회원가입이 완료되었습니다. 로그인 후 이용해주세요.' : message);

        if (isSuccess) {
          router.push('/signIn');
        }
      } catch (error) {
        toast.error('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <div>
              <img src="/img/loginLogo.png" alt="Logo" className={classes.logo} onClick={() => router.push('/')} />
            </div>
            <CardBody>
              <div className={classes.dividerContainer}>
                <h3 variant="body1" className={classes.snsText}>
                  회원가입
                </h3>
              </div>
              <form onSubmit={handleSubmit} className={classes.form}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <Button variant="contained" style={{ backgroundColor: "#7D4A1A", color: "white" }} onClick={handleEmailCheck} className={classes.button}>
                    이메일 인증
                  </Button>
                </div>
                <span style={{ color: isEmailValid ? 'blue' : 'red' }}>{emailCheckMessage}</span>
                <br />
                <br />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TextField
                    label="인증번호"
                    type="text"
                    variant="outlined"
                    fullWidth
                    className={classes.textField}
                    value={certificationNumber}
                    onChange={(e) => setCertificationNumber(e.target.value)}
                    required
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: isEmailValid ? "#7D4A1A" : "#c0c0c0",
                      color: "white",
                    }} 
                    onClick={handleSendCertificationEmail}
                    className={classes.button}
                    disabled={!isEmailValid}
                  >
                    인증 메일 발송
                  </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: isCertificationButtonEnabled ? "#7D4A1A" : "#c0c0c0",
                      color: "white"
                    }} 
                    onClick={handleCertification}
                    className={classes.buttonSmall}
                    disabled={!isCertificationButtonEnabled}
                  >
                    {certificationButtonLabel}
                  </Button>
                </div>
                <span style={{ color: isCertificationSuccess ? 'blue' : 'red' }}>{certificationMessage}</span>
                {isCertificationButtonEnabled && <span>{formatTime(timer)}</span>}
                <br />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: '5px', paddingLeft: '5px' }}>
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
                <TextField
                  label="비밀번호 확인"
                  type="password"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  required
                />
                {showPasswordMessage && (
                  <span style={{ color: passwordMessage.includes('유효합니다') ? 'blue' : 'red' }}>
                    {passwordMessage}
                  </span>
                )}
                <br />
                <br />
                <TextField
                  label="이름"
                  type="text"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="닉네임"
                  type="text"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.buttonSmall}
                  style={{
                    backgroundColor: isFormValid && isEmailValid ? "#7D4A1A" : "#c0c0c0",
                    color: "white",
                    marginTop: '20px'
                  }} 
                  disabled={!isFormValid || !isEmailValid}
                >
                  회원가입
                </Button>
                <div className={classes.loginContainer}>
                  <p className={classes.loginText}>이미 fit-box 계정이 있으신가요?</p>
                  <a className={classes.loginText} href="/signIn">로그인</a>
                </div>
                </div>
              </form>
            </CardBody>
          </Card>
      </GridItem>
    </GridContainer>
  );
}
