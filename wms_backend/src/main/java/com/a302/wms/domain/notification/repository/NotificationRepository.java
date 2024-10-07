package com.a302.wms.domain.notification.repository;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.entity.Notification;
import java.util.List;

import com.a302.wms.global.constant.NotificationTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ")
  List<Notification> findAllByUserId(Long userId);

  @Query(
      "SELECT n FROM Notification n WHERE n.store.id = :storeId "
          + "AND n.notificationTypeEnum = :type ")
  List<Notification> findAllByStoreIdAndType(Long storeId, NotificationTypeEnum type);

  @Query(
          "SELECT n FROM Notification n WHERE n.store.id = :storeId ")
  List<Notification> findAllByStoreId(Long storeId);
}
