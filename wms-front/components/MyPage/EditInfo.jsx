import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { fetchStores, createDevice } from '../../pages/api/index'; 
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

    const getStoreDetails = async (storeId) => {
        try {
            const response = await fetchStores(); // 매장 상세 정보 가져오는 API로 대체
            const updatedStore = response.data.result.find(store => store.id === storeId);
            setCurrentStore(updatedStore);
        } catch (error) {
            console.error("매장 상세 정보 가져오기 실패:", error);
        }
    };

    const addDevice = async (deviceType) => {
        try {
            const data = {
                "storeId" : currentStore.id,
                "deviceType" : deviceType
            };
            await createDevice(data); 
            await getStoreDetails(currentStore.id); // 새로 추가된 기기를 반영하기 위해 매장 정보 다시 불러오기
        } catch (error) {
            console.error("기기 추가 실패:", error);
        }
    };

    const handleOpen = async (store) => {
        await getStoreDetails(store.id); // 매장 상세 정보 가져오기
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentStore(null);
    };

    const handleAddDevice = async (deviceType) => {
        await addDevice(deviceType); // 기기 추가 후 매장 정보를 다시 불러와 업데이트
    };

    const handleDeleteDevice = (deviceId) => {
        // 기기 삭제 로직
        console.log('기기 삭제', deviceId);
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
                            {currentStore.devices && currentStore.devices.length > 0 ? (
                                <div className={classes.deviceList}>
                                    <h4>등록된 기기 목록</h4>
                                    {currentStore.devices.map((device) => (
                                        <div key={device.id}>
                                            <p>기기 id: {device.id}</p>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                기기 삭제
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>등록된 기기가 없습니다.</p>
                            )}
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
