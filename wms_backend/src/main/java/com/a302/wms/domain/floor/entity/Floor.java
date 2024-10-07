package com.a302.wms.domain.floor.entity;

import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    public Floor(Integer floorLevel, Long id, Location location, Product product) {
        this.floorLevel = floorLevel;
        this.id = id;
        this.location = location;
        this.product = product;
    }


    //연관관계 편의 메서드
    public Floor setLocation(Location location) {
        this.location = location;
        if (!location.getFloorList().contains(this)) {
            location.getFloorList().add(this);
        }
        return this;
    }

    public void updateProduct(Product product) {
        this.product = product;
    }
}
