package com.a302.wms.domain.camera.entity;

import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "camera")
@RequiredArgsConstructor
@Getter
public class Camera extends BaseTimeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "notification_id")
  private Notification notification;

  @Column(name = "url", length = 2083)
  private String url;

  @Column(name = "title")
  private String title;

  @Column(name = "category")
  private String category;

  @Builder
  public Camera(Long id, Notification notification, String url, String title, String category) {
    this.id = id;
    this.notification = notification;
    this.url = url;
    this.title = title;
    this.category = category;
  }

  public void setNotification(Notification notification) {
    this.notification = notification;
    notification.getCameraList().add(this);
  }
}
