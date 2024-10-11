package com.a302.wms.domain.camera.repository;

import com.a302.wms.domain.camera.dto.CameraResponse;
import com.a302.wms.domain.camera.entity.Camera;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface CameraRepository extends JpaRepository<Camera, Long> {
  @Query("SELECT c FROM Camera c WHERE c.notification.id = :notificationId")
  Camera findByNotificationId(Long notificationId);

  @Query("SELECT c FROM Camera c WHERE c.title = :title")
  Camera findByTitle(String title);

  @Query(
      "SELECT new com.a302.wms.domain.camera.dto.CameraResponse (c.id, c.notification.id, null, c.category, c.url, c.createdDate, n.isRead, n.isImportant) "
          + "FROM Camera c JOIN Notification n ON c.notification.id = n.id "
          + "WHERE n.store.id = :storeId")
  List<CameraResponse> findAllByStoreId(Long storeId);
}
