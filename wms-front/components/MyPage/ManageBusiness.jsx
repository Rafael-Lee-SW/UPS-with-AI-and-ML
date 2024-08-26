import { Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { useRouter } from "next/router";
import axios from 'axios';
import { deleteBusinessEmployee } from "../../pages/api";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";

const useStyles = makeStyles(styles);

// 사업자 관리 Component
export default function ManageBusiness({ updateBusinessInfo, updateRoleType }) {
  const classes = useStyles();
  const router = useRouter();

  const [businessInfo, setBusinessInfo] = useState({ name: '', businessNumber: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [open, setOpen] = useState(false);
  const [roleType, setRoleType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState(null);
  const [businessAddDate, setBusinessAddDate] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? storedUser.id : null;
        
        if (userId) {
          const response = await axios.get(`https://i11a508.p.ssafy.io/api/users/${userId}`);
          const userData = response.data.result;
          
          setRoleType(userData.roleTypeEnum);
          setBusinessId(userData.businessId);
          setBusinessAddDate(userData.businessAddDate);

          if (userData.roleTypeEnum === 'BUSINESS' && userData.businessId !== -1) {
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            const businessData = businessResponse.data.result;
            setBusinessInfo({
              name: businessData.name,
              businessNumber: businessData.businessNumber
            });
            setIsRegistered(true);
          } else if (userData.roleTypeEnum === 'EMPLOYEE' && userData.businessId !== -1) {
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            setBusinessName(businessResponse.data.result.name);
          }
        } else {
          alert("로그인이 필요합니다.");
          router.push('/signIn');
        }
      } catch (error) {
        router.push('/404');
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        router.push('/404');
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        id: businessId,
        name: businessInfo.name,
        businessNumber: businessInfo.businessNumber,
        statusEnum: "ACTIVE"
      };

      if (isRegistered) {
        // 수정 로직
        await axios.put(`https://i11a508.p.ssafy.io/api/businesses/${businessId}`, data);
        setModalMessage('사업체 정보 수정이 완료되었습니다.');
        setModalTitle('사업체 정보 수정')
        handleOpen();
        
        updateBusinessInfo(data);
      } else {
        // 등록 로직
        const storedUser = JSON.parse(localStorage.getItem('user')); 
        const userId = storedUser ? storedUser.id : null; 

        if (userId) {
          // axios로 POST 요청 보내기
          const businessResponse = await axios.post(`https://i11a508.p.ssafy.io/api/businesses?userId=${userId}`, data);
          handleOpen()
          updateBusinessInfo(data);
          fetchUserData(data)

          // 새로 생성된 businessId 가져오기
          const newBusinessId = businessResponse.data.result.id; 

          // 구독 등록 요청
          const subscriptionData = {
            businessId: newBusinessId,
            paidTypeEnum: "KAKAOPAY", // 기본값 설정
            statusEnum: "ACTIVE", // 기본값 설정
            warehouseCount: 1, // 기본값 설정
          };

          await axios.post("https://i11a508.p.ssafy.io/api/subscriptions", subscriptionData);
          setModalMessage('창고 1개를 무료로 사용할 수 있습니다.');
          setModalTitle('사업자 등록 완료');
          handleOpen();
        } else {
          router.push('/404');
        }
      }
    } catch (error) {
      router.push('/404');
      router.push('/404');
    }
  };

  const handleDelete = async () => {
    try {
      // 사업체 비활성화 로직
      await axios.patch(`https://i11a508.p.ssafy.io/api/businesses/${businessId}`, { statusEnum: "INACTIVE" });
      setModalMessage('사업체 삭제가 완료되었습니다.');
      setModalTitle('사업체 삭제');
      handleOpen();
      router.push('/');
    } catch (error) {
      router.push('/404');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLeave = async () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? storedUser.id : null; 
        await deleteBusinessEmployee(userId, businessId);
        setModalMessage('사업장 탈퇴가 완료되었습니다.');
        setModalTitle('사업장 탈퇴');
        handleOpen();
        fetchUserData();
        updateRoleType('GENERAL');
    } catch (error) {
      router.push('/404');
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={classes.container}>
      {roleType === 'GENERAL' && (
        <div className={classes.renderContainer}>
          <h3 className={classes.h3}>사업자 등록</h3>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이름</strong></td>
                  <td className={classes.valueCell}>
                    <Input
                      type="text"
                      name="name"
                      className={classes.input}
                      value={businessInfo.name || ''}
                      onChange={handleChange}
                      placeholder="사업자 이름"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>사업자 번호</strong></td>
                  <td className={classes.valueCell}>
                    <Input
                      type="text"
                      name="businessNumber"
                      className={classes.input}
                      value={businessInfo.businessNumber || ''}
                      onChange={handleChange}
                      placeholder="사업자 번호"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={classes.buttonContainer}>
              <button 
                type="submit"
                className={classes.button}
                onClick={handleSubmit}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
      {roleType === 'EMPLOYEE' && (
      <div className={classes.renderContainer}>
        <h3 className={classes.h3}>소속 사업체</h3>
         <div className={classes.tableContainer}>
            <table className={classes.table}>
                <tbody>
                  <tr>
                    <td className={classes.labelCell}><strong className={classes.text}>사업체 이름</strong></td>
                    <td className={classes.valueCell}>{businessName}</td>
                  </tr>
                  <tr>
                    <td className={classes.labelCell}><strong className={classes.text}>등록 일자</strong></td>
                    <td className={classes.valueCell}>{businessAddDate}</td>
                  </tr>
                </tbody>
            </table>
            <div className={classes.buttonContainer}>
                <button 
                    className={classes.button}
                    onClick={handleLeave}
                    >
                    탈퇴
                </button>
            </div>
         </div>
      </div>
      )}
      {roleType === 'BUSINESS' && (
        <div className={classes.renderContainer}>
          <h3 className={classes.h3}>사업자 수정</h3>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이름</strong></td>
                  <td className={classes.valueCell}>
                    <Input
                      type="text"
                      name="name"
                      className={classes.input}
                      value={businessInfo.name || ''}
                      onChange={handleChange}
                      placeholder="사업자 이름"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>사업자 번호</strong></td>
                  <td className={classes.valueCell}>
                    <Input
                      type="text"
                      name="businessNumber"
                      className={classes.input}
                      value={businessInfo.businessNumber || ''}
                      onChange={handleChange}
                      placeholder="사업자 번호"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={classes.buttonContainer}>
              <button 
                type="submit"
                className={classes.button}
                onClick={handleSubmit}
              >
                수정
              </button>
              <button onClick={handleDelete} className={classes.button}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.modalTitle}><DialogTitle>{modalTitle}</DialogTitle></div>
        <DialogContent>
            <>
              <p>{modalMessage}</p>
            </>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <button className={classes.modalCloseButton} onClick={handleClose}>
            X
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
