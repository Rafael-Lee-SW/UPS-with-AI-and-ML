package com.a302.wms.domain.product.entity;

import com.a302.wms.global.constant.ProductFlowTypeEnum;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
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

    @Column(name = "sku",nullable = false)
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
    private ProductFlowTypeEnum productFlowTypeEnum;

    @Builder
    public ProductFlow(Long presentFloorId, LocalDateTime flowDate,
                       Long productFlowId, Long previousFloorId, Long barcode,
                       ProductFlowTypeEnum productFlowTypeEnum, String productName,
                       String sku, Integer quantity) {
        this.presentFloorId = presentFloorId;
        this.flowDate = flowDate;
        this.productFlowId = productFlowId;
        this.previousFloorId = previousFloorId;
        this.barcode = barcode;
        this.productFlowTypeEnum = productFlowTypeEnum;
        this.productName = productName;
        this.sku = sku;
        this.quantity = quantity;
    }
}
