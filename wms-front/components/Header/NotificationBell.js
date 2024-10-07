import { useState, useEffect, useCallback } from 'react';
import { 
  Badge, IconButton, Popover, List, ListItem, ListItemText, Button 
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  // 더미 데이터를 사용하여 알림 설정
  const dummyNotifications = [
    {
      notificationId: 112,
      isRead: false,
      message: "방범 알림: 도난이 의심됩니다. 확인해주세요"
    }
  ];

  // 더미 데이터를 설정하는 함수
  const fetchNewNotifications = useCallback(() => {
    // API 호출 부분을 주석 처리하고 더미 데이터를 사용
    // try {
    //   const response = await notificationApi.getNew(userId);
    //   setNotifications(response.data);
    // } catch (error) {
    //   console.error('Failed to fetch notifications:', error);
    // }
    setNotifications(dummyNotifications);
  }, []); // 종속성 배열을 비워둡니다.

  useEffect(() => {
    fetchNewNotifications();
    const intervalId = setInterval(fetchNewNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNewNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 알림 클릭 시 URL로 이동
  const handleNotificationClick = (notificationId) => {
    router.push(`/user/12?videoId=${notificationId}`);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
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
              key={notification.notificationId} 
              button 
              onClick={() => handleNotificationClick(notification.notificationId)}
            >
              <ListItemText primary={notification.message} />
            </ListItem>
          ))}
        </List>
        <Button component={Link} href="/notifications" fullWidth>
          전체 알림 확인
        </Button>
      </Popover>
    </>
  );
};

export default NotificationBell;