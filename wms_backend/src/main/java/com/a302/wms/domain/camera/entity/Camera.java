package com.a302.wms.domain.camera.entity;

import com.a302.wms.domain.notification.entity.Notification;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "camera")
@RequiredArgsConstructor
@Getter
public class Camera {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToMany(mappedBy = "camera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<Notification> notificationList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Column(name = "url")
    private String url;

    @Builder
    public Camera(Long id, Notification notification, String url) {
        this.id = id;
        this.notification = notification;
        this.url = url;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
        notification.getCameraList().add(this);
    }
    //  동영상 1개 업로드 -> 알림 1개 생성
    // 알림 1개 -> 여러개의 동영상, 여러개의 상품정보
    // 한 개의 상품정보: 알림 1개
    // 알림 1 / 영상, 상품정보 다
}
