import { useState, useEffect, useCallback } from 'react';
import { 
  Badge, IconButton, Popover, List, ListItem, ListItemText, Button, Typography 
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import Link from 'next/link';
import { notificationApi } from '../services/api';

const NotificationBell = ({ userId }) => {
  // 알림 목록 상태
  const [notifications, setNotifications] = useState([]);
  // Popover 앵커 엘리먼트 상태
  const [anchorEl, setAnchorEl] = useState(null);

  // 새로운 알림을 가져오는 함수
  const fetchNewNotifications = useCallback(async () => {
    try {
      const response = await notificationApi.getNew(userId);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [userId]);

  // 컴포넌트 마운트 시 알림을 가져오고 30초마다 폴링
  useEffect(() => {
    fetchNewNotifications();
    const intervalId = setInterval(fetchNewNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNewNotifications]);

  // 알림 벨 아이콘 클릭 핸들러
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Popover 닫기 핸들러
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 알림 읽음 처리 핸들러
  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.update(id, { read: true });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* 알림 벨 아이콘 */}
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {/* 알림 목록 Popover */}
      <Popover
        open={open}
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
      >
        <List sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
          {notifications.map(notification => (
            <ListItem 
              key={notification.id} 
              button 
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <ListItemText primary={notification.message} />
            </ListItem>
          ))}
        </List>
        {/* 전체 알림 페이지로 이동하는 버튼 */}
        <Button component={Link} href="/notifications" fullWidth>
          전체 알림 확인
        </Button>
      </Popover>
    </>
  );
};