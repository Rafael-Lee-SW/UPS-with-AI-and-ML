package com.a302.wms.domain.camera.repository;

import com.a302.wms.domain.camera.entity.Camera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface CameraRepository extends JpaRepository<Camera, Long> {
    @Query("SELECT c FROM Camera c WHERE c.notification.id = :notificationId")
    Camera findByNotificationId(Long notificationId);
}
