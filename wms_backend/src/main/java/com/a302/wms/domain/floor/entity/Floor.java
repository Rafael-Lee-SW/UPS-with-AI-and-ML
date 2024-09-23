package com.a302.wms.domain.floor.entity;

import com.a302.wms.domain.location.entity.Location;
import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "floor")
public class Floor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int floorLevel;


    @OneToOne
    private Product product;

    @Builder
    public Floor(int floorLevel, Long id, Location location, Product product) {
        this.floorLevel = floorLevel;
        this.id = id;
        this.location = location;
        this.product = product;
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
