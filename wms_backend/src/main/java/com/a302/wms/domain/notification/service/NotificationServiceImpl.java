package com.a302.wms.domain.notification.service;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_NOTIFICATION_CRIME_MESSAGE;
import static com.a302.wms.global.constant.ProductConstant.DEFAULT_NOTIFICATION_FLOW_MESSAGE;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.dto.NotificationUpdateRequest;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.notification.mapper.NotificationMapper;
import com.a302.wms.domain.notification.repository.NotificationRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.constant.NotificationTypeEnum;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {
  private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);
  private final NotificationRepository notificationRepository;

  public void save(Notification notification) {
    log.info("[Service] save by notification ");
    notificationRepository.save(notification);
  }

  public List<NotificationResponse> findAllByUserId(Long userId) {

    log.info("[Service] findAllByUserId ");
    return notificationRepository.findAllByUserId(userId).stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  public List<NotificationResponse> findAllByStoreIdAndType(Long storeId, String type) {
    log.info("[Service] findAllByStoreIdAndType ");
    if (NotificationTypeEnum.isExist(type))
      return notificationRepository
          .findAllByStoreIdAndType(storeId, NotificationTypeEnum.valueOf(type))
          .stream()
          .map(NotificationMapper::toNotificationResponse)
          .toList();
    else return null;
  }

  public Notification createNotification(User user, Store store, NotificationTypeEnum type) {
    log.info("[Service] createNotification ");
    return Notification.builder()
        .notificationTypeEnum(type)
        .user(user)
        .store(store)
        .isRead(false)
        .isImportant(false)
        .message(
            type.name().equalsIgnoreCase(NotificationTypeEnum.CRIME_PREVENTION.name())
                ? NotificationTypeEnum.CRIME_PREVENTION.name() + DEFAULT_NOTIFICATION_CRIME_MESSAGE
                : type.getValue() + DEFAULT_NOTIFICATION_FLOW_MESSAGE)
        .build();
  }

  public List<NotificationResponse> findAllByStoreId(Long storeId) {
    log.info("[Service] findAllByStoreId ");
    return notificationRepository.findAllByStoreId(storeId).stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  public List<NotificationResponse> findAllByUserIdAndTypeAndIsRead(
      Long userId, String type, Boolean isRead) {
    log.info("[Service] findAllByUserIdAndTypeAndIsRead ");
    return notificationRepository
        .findAllByUserIdAndTypeAndIsRead(userId, NotificationTypeEnum.valueOf(type), isRead)
        .stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  public Object findAllByUserIdAndType(Long userId, String type) {
    log.info("[Service] findAllByUserIdAndType ");
    return notificationRepository
        .findAllByUserIdAndType(userId, NotificationTypeEnum.valueOf(type))
        .stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  public List<NotificationResponse> findAllByStoreIdAndTypeAndIsRead(
      Long storeId, String type, Boolean isRead) {
    log.info("[Service] findAllByStoreIdAndTypeAndIsRead ");
    return notificationRepository
        .findAllByStoreIdAndTypeAndIsRead(storeId, NotificationTypeEnum.valueOf(type), isRead)
        .stream()
        .map(NotificationMapper::toNotificationResponse)
        .toList();
  }

  @Transactional
  public void updateAll(List<NotificationUpdateRequest> notificationUpdateRequestList) {
    log.info("[Service] updateAll ");
    notificationUpdateRequestList.stream()
        .map(
            (notificationUpdateRequest ->
                NotificationMapper.fromNotificationUpdateResponse(
                    notificationUpdateRequest,
                    notificationRepository
                        .findById(notificationUpdateRequest.notificationId())
                        .orElseThrow(NullPointerException::new))))
        .forEach(notificationRepository::save);
  }
}
