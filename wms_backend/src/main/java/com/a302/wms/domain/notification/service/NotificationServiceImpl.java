package com.a302.wms.domain.notification.service;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.notification.mapper.NotificationMapper;
import com.a302.wms.domain.notification.repository.NotificationRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.constant.NotificationTypeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_NOTIFICATION_CRIME_MESSAGE;
import static com.a302.wms.global.constant.ProductConstant.DEFAULT_NOTIFICATION_FLOW_MESSAGE;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {
  private final NotificationRepository notificationRepository;

  public void save(Notification notification) {
    notificationRepository.save(notification);
  }

  public List<NotificationResponse> findAllByUserId(Long userId) {
    return notificationRepository.findAllByUserId(userId).stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  public List<NotificationResponse> findAllByStoreIdAndType(Long storeId, String type) {
    if (NotificationTypeEnum.isExist(type))
      return notificationRepository
          .findAllByStoreIdAndType(storeId, NotificationTypeEnum.valueOf(type))
          .stream()
          .map(NotificationMapper::toNotificationResponse)
          .toList();
    else return null;
  }
  public Notification createNotification(User user, Store store, NotificationTypeEnum type) {
    return Notification.builder()
            .notificationTypeEnum(type)
            .user(user)
            .store(store)
            .isRead(false)
            .isImportant(false)
            .message(
                    type.name().equalsIgnoreCase(NotificationTypeEnum.CRIME_PREVENTION.name())
                            ? NotificationTypeEnum.CRIME_PREVENTION.name()
                            + DEFAULT_NOTIFICATION_CRIME_MESSAGE
                            : type.getValue() + DEFAULT_NOTIFICATION_FLOW_MESSAGE)
            .build();
  }

  public List<NotificationResponse> findAllByStoreId(Long storeId) {
    return notificationRepository.findAllByStoreId(storeId).stream()
            .map(NotificationMapper::toNotificationResponse).toList();

  }
}
