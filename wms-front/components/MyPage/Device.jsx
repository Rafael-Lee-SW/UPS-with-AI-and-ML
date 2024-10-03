import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { fetchStores } from '../../pages/api/index'; // API 가져오기
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

export default function Device({ userId }) {
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
            const response = await fetchStores(); // 유저의 매장 정보 가져오기
            const stores = response.data.result.storeResponseDto;
            setStores(stores);
        } catch (error) {
            router.push('/404'); // 에러 발생 시 404 페이지로 이동
        }
    };

    const handleOpen = (store) => {
        setCurrentStore(store); // 선택된 매장 정보 저장
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentStore(null);
    };

    const handleAddDevice = () => {
        // 기기 추가 로직
        console.log('기기 추가');
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
                            <p>{store.name}</p> {/* 매장 이름 표시 */}
                        </Card>
                    ))
                ) : (
                    <h4>매장이 없습니다.</h4>
                )}
            </div>

            {/* 매장 상세 정보 모달 */}
            <Dialog open={open} onClose={handleClose}>
                <div className={classes.modalTitle}><DialogTitle>매장 상세 정보</DialogTitle></div>
                <DialogContent>
                    {currentStore && (
                        <>
                            <p>매장 이름: {currentStore.name}</p>
                            {currentStore.devices && currentStore.devices.length > 0 ? (
                                <div className={classes.deviceList}>
                                    <h4>등록된 기기 목록</h4>
                                    {currentStore.devices.map((device) => (
                                        <div key={device.id}>
                                            <p>기기 이름: {device.name}</p>
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
                                onClick={handleAddDevice}
                            >
                                기기 추가
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
