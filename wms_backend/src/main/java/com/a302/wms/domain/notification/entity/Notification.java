package com.a302.wms.domain.notification.entity;

import com.a302.wms.domain.camera.entity.Camera;
import com.a302.wms.domain.product.entity.ProductFlow;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.BaseNotificationEntity;
import com.a302.wms.global.constant.NotificationTypeEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Notification")
@Getter
@RequiredArgsConstructor
public class Notification extends BaseNotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Camera> cameraList;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductFlow> productFlowList;

    @Enumerated(EnumType.STRING)
    private NotificationTypeEnum notificationTypeEnum;

    @Builder
    public Notification(Boolean isRead, Boolean isImportant, String message, Long id, User user, Store store, List<Camera> cameraList, List<ProductFlow> productFlowList, NotificationTypeEnum notificationTypeEnum) {
        super(isRead, isImportant, message);
        this.id = id;
        this.user = user;
        this.store = store;
        this.cameraList = cameraList;
        this.productFlowList = productFlowList;
        this.notificationTypeEnum = notificationTypeEnum;
    }
}
