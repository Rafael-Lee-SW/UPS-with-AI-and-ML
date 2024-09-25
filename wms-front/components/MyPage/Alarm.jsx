import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/notificationsStyles.js'
import { fetchNotifications } from '../../pages/api';
import { useRouter } from 'next/router';

const useStyles = makeStyles(style)

// 알람 리스트 Component
export default function Alarm({ businessId }) {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [currentNotification, setCurrentNotification] = useState(null);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        if ( businessId !== -1 ) {
            try {
                const response = await fetchNotifications(businessId);
                const notifications = response.data.result.productFlowResponseDtos;
                
                setNotifications(notifications);
            } catch (error) {
                router.push('/404');
            }
        } else {
            setNotifications([]);
        }
        
    }

    const handleOpen = (notification) => {
        setCurrentNotification(notification);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.section}>
            <h3>알람 목록</h3>
            <div className={classes.cardContainer}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                    <Card key={notification.id} onClick={() => handleOpen(notification)} className={classes.card}>
                        <p 
                            style={{ 
                                margin: 0, 
                                color: 
                                    notification.productFlowType === 'IMPORT' ? 'blue' :
                                    notification.productFlowType === 'EXPORT' ? 'red' :
                                    notification.productFlowType === 'FLOW' ? 'green' : 'black'
                            }}
                        >
                            {notification.productFlowType === 'IMPORT' && '입고'}
                            {notification.productFlowType === 'EXPORT' && '출고'}
                            {notification.productFlowType === 'FLOW' && '이동'}
                        </p>
                        <p style={{ margin: 0 }}>{notification.date.substring(0, 10)}</p>
                    </Card>
                    ))
                ) : (
                <h4
                 style={{ paddingTop: '30px' }}>알림이 없습니다.</h4>
                )}
            </div>
            <Dialog 
            open={open} 
            onClose={handleClose}
            >
    <div className={classes.modalTitle}><DialogTitle>알람 상세 정보</DialogTitle></div>
    <DialogContent>
        {currentNotification && currentNotification.productFlowType === 'IMPORT' && (
            <>
                <p>이름 : {currentNotification.name}</p>
                <p>수량 : {currentNotification.quantity}개</p>
                {currentNotification.currentFloorLevel > 0 ? (
                    <p>입고 위치 : {currentNotification.currentLocationName} {currentNotification.currentFloorLevel}층</p>
                ) : (
                    <p>입고 위치 : {currentNotification.currentLocationName}</p>
                )}
                <p>입고 시간 : {currentNotification.date.substring(0, 10)} {currentNotification.date.substring(11, 16)}</p>
            </>
        )}

        {currentNotification && currentNotification.productFlowType === 'EXPORT' && (
            <>
                <p>이름 : {currentNotification.name}</p>
                <p>수량 : {currentNotification.quantity}개</p>
                <p>출고 위치 : {currentNotification.currentLocationName} {currentNotification.currentFloorLevel}층</p>
                <p>출고 시간 : {currentNotification.date.substring(0, 10)} {currentNotification.date.substring(11, 16)}</p>
            </>
        )}

        {currentNotification && currentNotification.productFlowType === 'FLOW' && (
            <>
                <p>이름 : {currentNotification.name}</p>
                <p>수량 : {currentNotification.quantity}개</p>
                {currentNotification.previousFloorLevel > 0 ? (
                    <p>이전 위치 : {currentNotification.previousLocationName} {currentNotification.previousFloorLevel}층</p>
                ) : (
                    <p>이전 위치 : {currentNotification.previousLocationName}</p>
                )}
                {currentNotification.currentFloorLevel > 0 ? (
                    <p>이동 위치 : {currentNotification.currentLocationName} {currentNotification.currentFloorLevel}층</p>
                ) : (
                    <p>이동 위치 : {currentNotification.currentLocationName}</p>
                )}
                <p>이동 시간 : {currentNotification.date.substring(0, 10)} {currentNotification.date.substring(11, 16)}</p>
            </>
        )}
    </DialogContent>
    <DialogActions>
        <button className={classes.modalCloseButton} onClick={handleClose}>
            X
        </button>
    </DialogActions>
</Dialog>

        </div>
    );
}
