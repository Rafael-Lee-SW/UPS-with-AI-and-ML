import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchBusiness, fetchUser } from './api';
import EditInfo from '../components/MyPage/EditInfo';
import SubInfo from '../components/MyPage/SubInfo';
import ManageBusiness from '../components/MyPage/ManageBusiness';
import ManageEmployees from '../components/MyPage/ManageEmployees';
import Info from '../components/MyPage/Info';
import Alarm from '../components/MyPage/Alarm';
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
  const [businessId, setBusinessId] = useState();
  const [roleTypeEnum, setRoleTypeEnum] = useState('');
  const [nickname, setNickname] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
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

  useEffect(() => {
    if (businessId && roleTypeEnum === 'BUSINESS') {
      getBusinessInfo();
    }
  }, [businessId]);

  const updateBusinessInfo = (newBusinessData) => {
    setBusinessName(newBusinessData.name);
    setBusinessNumber(newBusinessData.businessNumber);
  }

  const updateRoleType = (newRoleType) => {
    setRoleTypeEnum(newRoleType);
  }

  const getUserInfo = async () => {
    try {
      const response = await fetchUser(userId);
      const { id, name, email, nickname, roleTypeEnum, businessId } = response.data.result;

      setUserId(id);
      setName(name);
      setEmail(email);
      setBusinessId(businessId);
      setRoleTypeEnum(roleTypeEnum);
      setNickname(nickname);

    } catch (error) {
      router.push('/404');
    }
  }

  const getBusinessInfo = async () => {
    if (!businessId || businessId === -1) { // 비즈니스 ID가 null이거나 -1일 경우
      setBusinessName('');
      setBusinessNumber('');
      setCreatedDate('');
      return; // 함수 종료
    }
  
    try {
      const response = await fetchBusiness(businessId);
      const { name, businessNumber, createdDate } = response.data.result;
    
      setBusinessName(name);
      setBusinessNumber(businessNumber);
      setCreatedDate(createdDate);
  
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
        return <EditInfo userId={userId} name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} roleTypeEnum={roleTypeEnum}/>;
      case 'license':
        return <ManageBusiness businessId={businessId} businessName={businessName} businessNumber={businessNumber} updateBusinessInfo={updateBusinessInfo} updateRoleType={updateRoleType}/>;
      case 'subscriptions':
        return <SubInfo businessId={businessId} />;
      case 'employees':
        return <ManageEmployees businessId={businessId}/>;
      case 'info':
        return <Info name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} createdDate={createdDate} roleTypeEnum={roleTypeEnum} />;
      default:
        return (
          <div>
            <Info name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} createdDate={createdDate} roleTypeEnum={roleTypeEnum} />
          </div>
        );
    }
  }

  return (
  <div className={classes.container}>
    {roleTypeEnum === 'BUSINESS' ? (
      <div className={classes.leftPanel}>
        <div className={classes.titleContainer}>
          <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        </div>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('license')}>사업자 등록/수정</h4>
          <h4 onClick={() => setSelectedComponent('employees')}>직원 관리</h4>
          <h4 onClick={() => setSelectedComponent('subscriptions')}>구독 정보</h4>
        </div>
      </div>
    ) : roleTypeEnum === 'EMPLOYEE' ? (
      <div className={classes.leftPanel}>
        <div className={classes.titleContainer}>
          <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        </div>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('license')}>소속 사업체</h4>
        </div>
      </div>
    ) : (
      <div className={classes.leftPanel}>
        <div className={classes.titleContainer}>
          <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        </div>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('license')}>사업자 등록/수정</h4>
        </div>
      </div>
    )}
    <div className={classes.rightPanel}>
      <div className={classes.rendering}>
        {renderComponent()}
      </div>
    </div>
  </div>
  )
}
