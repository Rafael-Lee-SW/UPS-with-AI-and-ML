package com.a302.wms.domain.product.entity;

import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Table(name = "product_flow")
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductFlow extends BaseTimeEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productFlowId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "barcode", nullable = false)
    private Long barcode;

    @Column(name = "sku")
    private String sku;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "flow_date", nullable = false)
    private LocalDateTime flowDate;

    @Column(name = "present_floor_id", nullable = false)
    private Long presentFloorId;

    @Column(name = "previous_floor_id")
    private Long previousFloorId;

    @Column(name = "product_flow_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductFlowTypeEnum productFlowTypeEnum;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Notification notification;

    @Builder
    public ProductFlow(Long productFlowId,
                       String productName,
                       Long barcode,
                       String sku,
                       Integer quantity,
                       LocalDateTime flowDate,
                       Long presentFloorId,
                       Long previousFloorId,
                       ProductFlowTypeEnum productFlowTypeEnum,
                       Long userId,
                       Long storeId,
                       Notification notification) {
        this.productFlowId = productFlowId;
        this.productName = productName;
        this.barcode = barcode;
        this.sku = sku;
        this.quantity = quantity;
        this.flowDate = flowDate;
        this.presentFloorId = presentFloorId;
        this.previousFloorId = previousFloorId;
        this.productFlowTypeEnum = productFlowTypeEnum;
        this.userId = userId;
        this.storeId = storeId;
        this.notification = notification;
    }
}
