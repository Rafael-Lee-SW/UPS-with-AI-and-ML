package com.a508.wms.business.domain;

import com.a508.wms.product.domain.ProductFlow;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.user.domain.User;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "business")
@NoArgsConstructor
@Builder
@SQLRestriction("status_enum = 'Active'")
@AllArgsConstructor
public class Business extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 20)
    private String name;

    @Column(length = 12)
    private String businessNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToMany(mappedBy = "business")
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Warehouse> warehouses = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<ProductFlow> productFlows = new ArrayList<>();

    // 연관 관계 편의 메서드
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            user.setBusiness(this);
        }
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateBusinessNumber(String businessNumber) {
        this.businessNumber = businessNumber;
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setProductDetails(List<ProductDetail> productDetails) {
        this.productDetails = productDetails;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public void setWarehouses(List<Warehouse> warehouses) {
        this.warehouses = warehouses;
    }

    public void setProductFlows(List<ProductFlow> productFlows) {
        this.productFlows = productFlows;
    }
}
