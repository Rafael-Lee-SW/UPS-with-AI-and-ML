import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { fetchStores, createDevice, deleteDevice, createOtpNumber } from '../../pages/api/index'; 
import { useRouter } from 'next/router';

const deviceStyles = makeStyles((theme) => ({
    cardContainer: {
        display: 'grid',
        gap: '20px',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        margin: '40px',
    },
    card: {
        padding: '10px',
        cursor: 'pointer',
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#f5f5f5',
        },
    },
    modalTitle: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalSubTitle: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '15px',
        marginBottom: 0
    },
    deviceContainer: {  
        display: 'flex',
        justifyContent: 'space-between', // 각 버튼 사이의 좌우 간격
        alignItems: 'center',
        marginBottom: '20px', // 리스트 사이의 상하 간격
        padding: '10px',
    },
    deviceList: {
        padding: '10px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    deviceButton: {
        margin: '10px 0',
        backgroundColor: 'lightgray',
        height: '40px',
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
    button: {
        margin: '10px',
        backgroundColor: '#7D4A1A',
        width: '100px',
        color: 'white',
        height: '40px',
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#5C3A1D',
            color: 'white',
        },
    },
    modalCloseButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    listTitle: {
        fontWeight: 'bold',
        fontSize: '18px',
        margin: '20px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingTop: '10px',
    },
    listCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        marginTop: '10px',
        width: '100%',
        border: '1px solid #7D4A1A',
        borderRadius: '4px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    addButtonContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    deviceId: {
        margin: 0,
        marginRight: '10px',
    }
}));


export default function Device() {
    const classes = deviceStyles();
    const router = useRouter();
    const [stores, setStores] = useState([]);
    const [currentStore, setCurrentStore] = useState(null); // 선택된 매장
    const [open, setOpen] = useState(false);
    const [otpState, setOtpState] = useState({}); // 각 기기의 OTP 상태를 저장할 객체

    useEffect(() => {
        getStores();
    }, []);

    const getStores = async () => {
        try {
            const response = await fetchStores(); 
            console.log(response)
            const stores = response.data.result;
            setStores(stores);
        } catch (error) {
            router.push('/404'); 
        }
    };

    const addDevice = async (deviceType) => {
        try {
            const data = {
                "storeId": currentStore.id,
                "deviceType": deviceType
            };
            const response = await createDevice(data); 
            const newDevice = response.data.result; 
            
            setCurrentStore(prevStore => ({
                ...prevStore,
                devices: [...prevStore.devices, newDevice] 
            }));
                
        } catch (error) {
        }
    };

    const removeDevice = async (deviceId) => {
        try {
            await deleteDevice(deviceId); 
            
            setCurrentStore(prevStore => ({
                ...prevStore,
                devices: prevStore.devices.filter(device => device.id !== deviceId) 
            }));
        } catch (error) {
            console.error("기기 삭제 실패:", error);
        }
    };

    const createOtp = async (deviceId) => {
        try {
            const response = await createOtpNumber(deviceId); 
            const otp = response.data.result;

            setOtpState(prevState => ({
                ...prevState,
                [deviceId]: otp 
            }));

            setTimeout(() => {
                setOtpState(prevState => ({
                    ...prevState,
                    [deviceId]: null
                }));
            }, 300000); 

        } catch (error) {
            alert("OTP 발급에 실패했습니다.");
        }
    };

    const handleOpen = (store) => {
        setCurrentStore(store); 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentStore(null);
    };

    const handleAddDevice = (deviceType) => {
        addDevice(deviceType); 
    };

    const handleDeleteDevice = (deviceId) => {
        removeDevice(deviceId);
    };

    const handleOtp = (deviceId) => {
        createOtp(deviceId); 
    };

    return (
        <div className={classes.container}>
            <h3>매장 리스트</h3>
            <div className={classes.cardContainer}>
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <Card key={store.id} onClick={() => handleOpen(store)} className={classes.card}>
                            <p style={{ margin: 0}}>{store.storeName}</p> 
                        </Card>
                    ))
                ) : (
                    <h4>매장이 없습니다.</h4>
                )}
            </div>

            <Dialog open={open} onClose={handleClose}>
                <div className={classes.modalTitle}><DialogTitle>매장 상세 정보</DialogTitle></div>
                <DialogContent>
                    {currentStore && (
                        <>
                            <p className={classes.modalSubTitle}>{currentStore.storeName}</p>
                            <div className={classes.deviceList}>
                                <h4 className={classes.listTitle}>등록된 키오스크 목록</h4>
                                {currentStore.devices && currentStore.devices.length > 0 ? (
                                    currentStore.devices.filter(device => device.deviceType === 'KIOSK').map((device) => (
                                        <div key={device.id} className={classes.deviceContainer}>
                                            <p className={classes.deviceId}>키오스크 ID: {device.id}</p>
                                            <button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                삭제
                                            </button>
                                            <button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleOtp(device.id)} 
                                                style={{ marginLeft: '10px' }} 
                                            >
                                                {otpState[device.id] ? otpState[device.id] : 'OTP 발급하기'} 
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 키오스크가 없습니다.</p>
                                )}
                                
                                <h4 className={classes.listTitle}>등록된 카메라 목록</h4>
                                {currentStore.devices && currentStore.devices.length > 0 ? (
                                    currentStore.devices.filter(device => device.deviceType === 'CAMERA').map((device) => (
                                        <div key={device.id} className={classes.deviceContainer}>
                                            <p className={classes.deviceId}>카메라 ID: {device.id}</p>
                                            <button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                삭제
                                            </button>
                                            <button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleOtp(device.id)} // OTP 발급 버튼
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {otpState[device.id] ? otpState[device.id] : 'OTP 발급하기'}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 카메라가 없습니다.</p>
                                )}
                            </div>
                            <div className={classes.addButtonContainer}>
                                <button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleAddDevice('KIOSK')}
                                    style={{ marginRight: '10px' }}
                                >
                                    KIOSK 추가
                                </button>
                                <button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleAddDevice('CAMERA')}
                                    style={{ marginRight: '10px' }}
                                >
                                    CAMERA 추가
                                </button>
                            </div>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>닫기</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
