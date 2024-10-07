package com.a302.wms.domain.notification.service;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.notification.mapper.NotificationMapper;
import com.a302.wms.domain.notification.repository.NotificationRepository;
import com.a302.wms.global.constant.NotificationTypeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {
    private final NotificationRepository notificationRepository;

    public void save(Notification notification) {
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> findAllByUserId(Long userId) {
        return notificationRepository.findAllByUserId(userId)
                .stream().map(NotificationMapper::toNotificationResponse).toList();
    }

    public List<NotificationResponse> findAllCrimeByStoreId(Long storeId,
                                                            String type) {
        return notificationRepository.findAllCrimeByStoreId(storeId, NotificationTypeEnum.valueOf(type))
                .stream().map(NotificationMapper::toNotificationResponse).toList();
    }
}
