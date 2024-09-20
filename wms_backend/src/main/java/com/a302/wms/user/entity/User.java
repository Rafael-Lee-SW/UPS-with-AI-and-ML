package com.a302.wms.user.entity;

import com.a302.wms.product.entity.ProductFlow;
import com.a302.wms.productdetail.entity.ProductDetail;
import com.a302.wms.subscription.entity.Subscription;
import com.a302.wms.util.BaseTimeEntity;
import com.a302.wms.util.constant.StatusEnum;
import com.a302.wms.warehouse.entity.Store;
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
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder

@AllArgsConstructor
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 20)
    private String name;

    @Column(length = 12)
    private String userNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToMany(mappedBy = "user")
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Store> warehouses = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<ProductFlow> productFlows = new ArrayList<>();

    // 연관 관계 편의 메서드
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            user.setUser(this);
        }
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateUserNumber(String userNumber) {
        this.userNumber = userNumber;
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

    public void setStores(List<Store> warehouses) {
        this.warehouses = warehouses;
    }

    public void setProductFlows(List<ProductFlow> productFlows) {
        this.productFlows = productFlows;
    }
}
