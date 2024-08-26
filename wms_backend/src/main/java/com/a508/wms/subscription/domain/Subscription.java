package com.a508.wms.subscription.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.PaidTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "subscription")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("status_enum = 'Active'")
public class Subscription extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    @Builder.Default // Builder 패턴을 사용할 때 기본값을 설정
    private int warehouseCount = 1; // 처음에 1로 설정

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime startDate;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaidTypeEnum paidTypeEnum;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getSubscriptions().add(this);
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setPaidTypeEnum(PaidTypeEnum paidTypeEnum) {
        this.paidTypeEnum = paidTypeEnum;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setWarehouseCount(int count) {
        this.warehouseCount = count;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    // 창고 수 관리 메서드
    public void incrementWarehouseCount() {
        this.warehouseCount++;
    }

    public void decrementWarehouseCount() {
        if (this.warehouseCount > 0) {
            this.warehouseCount--;
        }
    }
}
