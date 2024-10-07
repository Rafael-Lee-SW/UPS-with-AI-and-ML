import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/notificationsStyles.js';
import { fetchCrimeNotifications, fetchStores } from '../../pages/api/index';
import { useRouter } from 'next/router';

const useStyles = makeStyles(style);

export default function Alarm({ userId }) {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [currentStore, setCurrentStore] = useState(null);

    // 매장 정보를 가져오는 useEffect
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

    // 선택한 매장의 알림을 가져오는 함수
    const getNotifications = async (store) => {
        try {
            const response = await fetchCrimeNotifications(store.id);
            const notifications = response.data.result;
            setNotifications(notifications);
        } catch (error) {
            router.push('/404');
        }   
    }

    // 매장 클릭 시 알림을 가져오고 모달을 여는 함수
    const handleOpen = (store) => {
        setCurrentStore(store);
        getNotifications(store); 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNotifications([]); // 모달 닫을 때 알림 초기화
    };

    return (
        <div className={classes.container}>
            <h3>매장별 알림</h3>
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

            {/* 알림 모달 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentStore ? `${currentStore.storeName}의 알림` : ''}</DialogTitle>
                <DialogContent>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id}>
                                <p>{notification.message}</p>
                                <p>시간: {notification.date.substring(0, 10)} {notification.date.substring(11, 16)}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <h4>알림이 없습니다.</h4>
                    )}
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>닫기</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
