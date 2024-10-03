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

  const defaultUser = {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    nickname: "길동",
    businessId: 101,
    roleTypeEnum: "BUSINESS",
    businessName: "홍길동 상사",
    businessNumber: "123-45-67890",
    createdDate: "2020-01-01"
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    if (user && accessToken) {
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
      const { id, name, email } = response.data.result;
      setUserId(id);
      setName(name);
      setEmail(email);
    } catch (error) {
      router.push('/404');
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }
  

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'alarm':
        return <Alarm businessId={businessId} />;
      case 'edit':
        return <EditInfo userId={userId} name={name} email={email} createdDate={createdDate}/>;
      case 'info':
        return <Info name={name} email={email} createdDate={createdDate}/>;
      case 'device':
        return <Device userId={userId}/>
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
          <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        </div>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('device')}>기기 관리</h4>
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
