import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchBusiness, fetchUser } from '../pages/api/index';
import EditInfo from '../components/MyPage/EditInfo';
import Info from '../components/MyPage/Info';
import Alarm from '../components/MyPage/Alarm';
import Device from '../components/MyPage/Device';
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/mypageStyle.js";
import { useRouter } from 'next/router'; 

const useStyles = makeStyles(styles);

export default function Mypage() {
  const classes = useStyles();
  const router = useRouter();
  const { query } = router;

  // URL 쿼리 파라미터를 통해 초기 상태 설정
  const [selectedComponent, setSelectedComponent] = useState(query.component || 'info');

  const [userId, setUserId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdDate, setCreatedDate] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      setUserId(user.id);
    } else {
      alert("로그인이 필요합니다.");
      router.push('/signin');
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId, selectedComponent]);

  const getUserInfo = async () => {
    try {
      const response = await fetchUser(userId);
      console.log(response)
      const { id, userName, email, createdDate } = response.data.result;
      setUserId(id);
      setName(userName);
      setEmail(email);
      setCreatedDate(createdDate);
    } catch (error) {
      router.push('/404');
    }
  }
  
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'alarm':
        return <Alarm userId={userId} />;
      case 'edit':
        return <EditInfo userId={userId} name={name} email={email} createdDate={createdDate}/>;
      case 'info':
        return <Info name={name} email={email} createdDate={createdDate}/>;
      case 'device':
        return <Device/>
      default:
        return (
          <div>
            <Info name={name} email={email} createdDate={createdDate}/>
          </div>
        );
    }
  }

  return (
  <div className={classes.container}>
    <div className={classes.leftPanel}>
        <div className={classes.titleContainer}>
          <h2 
            className={`${classes.h2} ${selectedComponent === 'info' ? classes.selected : ''}`} 
            onClick={() => setSelectedComponent('info')}
          >
            마이페이지
          </h2>
        </div>
        <div className={classes.divContainer}>
          <h4 
            className={`${classes.menuItem} ${selectedComponent === 'alarm' ? classes.selected : ''}`} 
            onClick={() => setSelectedComponent('alarm')}
          >
            알람
          </h4>
          <h4 
            className={`${classes.menuItem} ${selectedComponent === 'edit' ? classes.selected : ''}`} 
            onClick={() => setSelectedComponent('edit')}
          >
            내 정보 수정
          </h4>
          <h4 
            className={`${classes.menuItem} ${selectedComponent === 'device' ? classes.selected : ''}`} 
            onClick={() => setSelectedComponent('device')}
          >
            기기 관리
          </h4>
        </div>
      </div>
    <div className={classes.rightPanel}>
      <div className={classes.rendering}>
        {renderComponent()}
      </div>
    </div>
  </div>
  )
}
