'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Badge, IconButton, Popover, List, ListItem, ListItemText, Button, CircularProgress 
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles } from "@material-ui/core/styles";
import styles from "/styles/jss/nextjs-material-kit/components/userHeaderLinksStyle.js";
import { fetchUnreadCrimeNotifications, updateCrimeNotifications } from "../../pages/api/index";

const useStyles = makeStyles(styles);

const NotificationBell = ({ userId }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sortNotifications = (notifications) => {
    return notifications.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUnreadCrimeNotifications();
      console.log('API Response:', response.data); // 디버깅용 로그
      
      if (response.data && response.data.success && Array.isArray(response.data.result)) {
        const sortedNotifications = sortNotifications(response.data.result);
        setNotifications(sortedNotifications);
      } else {
        console.error('Unexpected API response format:', response);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(); // 초기 로드

    // 30초마다 알림 갱신
    const intervalId = setInterval(() => {
      console.log('Fetching notifications at:', new Date().toLocaleString()); // 폴링 시점 로깅
      fetchNotifications();
    }, 30000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      console.log('Notification to update:', notification);
      await updateCrimeNotifications([
        { notificationId: notification.id, isRead: true, isImportant: notification.isImportant }
      ]);
      setNotifications(prevNotifications => 
        sortNotifications(prevNotifications.map(notif => 
          notif.id === notification.id ? { ...notif, isRead: true } : notif
        ))
      );
      router.push(`/user/${notification.storeId}?videoId=${notification.id}`);
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
    handleClose();
  };

  const unreadNotifications = notifications.filter(notif => !notif.isRead);

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        className={classes.notificationBell}
      >
        <Badge 
          badgeContent={unreadNotifications.length} 
          color="error"
          classes={{
            badge: classes.notificationBadge
          }}
        >
          <NotificationsIcon className={classes.notificationIcon} />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.notificationPopover
        }}
      >
        <div className={classes.notificationHeader}>
          알림
        </div>
        <List className={classes.notificationList}>
          {loading ? (
            <ListItem>
              <CircularProgress size={24} />
            </ListItem>
          ) : unreadNotifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="새로운 알림이 없습니다." className={classes.notificationText} />
            </ListItem>
          ) : (
            unreadNotifications.map(notification => (
              <ListItem 
                key={notification.id} 
                button 
                onClick={() => handleNotificationClick(notification)}
                className={classes.notificationItem}
              >
                <ListItemText 
                  primary={`${notification.notificationTypeEnum} 알림`}
                  secondary={new Date(notification.createdDate).toLocaleString()}
                  className={classes.notificationText}
                />
              </ListItem>
            ))
          )}
        </List>
        <Button 
          component={Link} 
          href="/mypage?component=alarm"
          fullWidth 
          className={classes.viewAllButton}
        >
          전체 알림 확인
        </Button>
      </Popover>
    </>
  );
};

export default NotificationBell;