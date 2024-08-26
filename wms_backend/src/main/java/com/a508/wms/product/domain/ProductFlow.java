package com.a508.wms.product.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.ProductFlowTypeEnum;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Table(name = "product_flow")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SQLRestriction("status_enum = 'Active'")
public class ProductFlow extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    private Long warehouseId;

    @Column(nullable = false)
    private Long barcode;

    @Column
    private String previousLocationName;
    @Column
    private Integer previousFloorLevel;

    @Column(nullable = false)
    private String currentLocationName;

    @Column(nullable = false)
    private int currentFloorLevel;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String trackingNumber;

    @Column(name = "expiration_date", columnDefinition = "DATETIME")
    private LocalDateTime expirationDate;
    @Column
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStorageTypeEnum productStorageType;

    @Column
    private String warehouseName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductFlowTypeEnum productFlowType;
    public void updateBusiness(Business business) {
        this.business = business;
        business.getProductFlows().add(this);

    }
}
