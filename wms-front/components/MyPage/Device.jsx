import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { fetchStores, createDevice, deleteDevice, createOtpNumber } from '../../pages/api/index'; 
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    },
    card: {
        padding: '20px',
        cursor: 'pointer',
    },
    modalTitle: {
        textAlign: 'center',
    },
    deviceList: {
        margin: '20px 0',
    },
    deviceButton: {
        margin: '10px 0',
    }
}));

export default function Device() {
    const classes = useStyles();
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
        <div>
            <h3>매장 리스트</h3>
            <div className={classes.cardContainer}>
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <Card key={store.id} onClick={() => handleOpen(store)} className={classes.card}>
                            <p>{store.storeName}</p> 
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
                            <p>매장 이름: {currentStore.storeName}</p>
                            <div className={classes.deviceList}>
                                <h4>등록된 키오스크 목록</h4>
                                {currentStore.devices && currentStore.devices.length > 0 ? (
                                    currentStore.devices.filter(device => device.deviceType === 'KIOSK').map((device) => (
                                        <div key={device.id}>
                                            <p>키오스크 ID: {device.id}</p>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                삭제
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleOtp(device.id)} 
                                                style={{ marginLeft: '10px' }} 
                                            >
                                                {otpState[device.id] ? otpState[device.id] : 'OTP 발급하기'} 
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 키오스크가 없습니다.</p>
                                )}
                                
                                <h4>등록된 카메라 목록</h4>
                                {currentStore.devices && currentStore.devices.length > 0 ? (
                                    currentStore.devices.filter(device => device.deviceType === 'CAMERA').map((device) => (
                                        <div key={device.id}>
                                            <p>카메라 ID: {device.id}</p>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                삭제
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleOtp(device.id)} // OTP 발급 버튼
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {otpState[device.id] ? otpState[device.id] : 'OTP 발급하기'}
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 카메라가 없습니다.</p>
                                )}
                            </div>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                className={classes.deviceButton}
                                onClick={() => handleAddDevice('KIOSK')}
                            >
                                KIOSK 추가
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                className={classes.deviceButton}
                                onClick={() => handleAddDevice('CAMERA')}
                            >
                                CAMERA 추가
                            </Button>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>닫기</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
