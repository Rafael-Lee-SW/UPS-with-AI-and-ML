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

    const getNotifications = async (store) => {
        try {
            const response = await fetchCrimeNotifications(store.id);
            const notifications = response.data.result;
            console.log(notifications);
            setNotifications(notifications);
        } catch (error) {
            router.push('/404');
        }   
    }

    const handleOpen = (store) => {
        setCurrentStore(store);
        getNotifications(store); 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNotifications([]); 
    };

    const handleDetail = (notificationId) => {
        router.push(`/user/${currentStore.id}?videoId=${notificationId}`);
    }

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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle className={classes.modalTitle}>{currentStore ? `${currentStore.storeName}` : ''}</DialogTitle>
                <DialogContent>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className={classes.noticeContainer} onClick={() => handleDetail(notification.id)}>
                                <span style={{ margin: 0}}>{notification.message}</span>
                                <span style={{ margin: '0px 5px', fontSize: '13px', color: notification.isRead ? 'blue' : 'red' }}>{ notification.isRead ? '읽음' : '안읽음' }</span>
                            </div>
                        ))
                    ) : (
                        <h4>알림이 없습니다.</h4>
                    )}
                </DialogContent>
                <DialogActions>
                    <button className={classes.button} onClick={handleClose}>닫기</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
