package com.a302.wms.floor.entity;

import com.a302.wms.location.entity.Location;
import com.a302.wms.product.entity.Product;
import com.a302.wms.util.BaseTimeEntity;
import com.a302.wms.util.constant.ExportTypeEnum;
import com.a302.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter

@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "floor")
@ToString
public class Floor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int floorLevel;

    @Column(nullable = false)
    private ExportTypeEnum exportTypeEnum;

    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToOne
    @Builder.Default
    private Product product;

    public void updateStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    //삭제 처리
    public void delete() {
        this.statusEnum = StatusEnum.DELETED;
    }

    //연관관계 편의 메서드
    public Floor setLocation(Location location) {
        this.location = location;
        if (!location.getFloors().contains(this)) {
            location.getFloors().add(this);
        }
        return this;
    }

    public void updateProduct(Product product) {
        this.product = product;
    }
}
