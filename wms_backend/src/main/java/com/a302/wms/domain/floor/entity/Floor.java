package com.a302.wms.domain.floor.entity;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;

import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "floor")
public class Floor extends BaseTimeEntity {

  private static final Logger log = LoggerFactory.getLogger(Floor.class);

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "location_id", nullable = false)
  private Location location;

  @Column(nullable = false)
  private int floorLevel;

    @OneToMany(mappedBy = "floor", fetch = FetchType.LAZY)
    private List<Product> productList;

    @Builder
    public Floor(Long id, int floorLevel, Location location, List<Product> productList) {
        this.id = id;
        this.floorLevel = floorLevel;
        this.location = location;
        this.productList = productList;
    }


//    public void updateProduct(Product product) {
//        this.product = product;
//    }

    // 연관관계 편의 메서드
    public Floor setLocation(Location location) {
        this.location = location;
        if (!location.getFloorList().contains(this)) {
            location.getFloorList().add(this);
        }
        return this;
    }


    public boolean isDefault() {
        return this.floorLevel == DEFAULT_FLOOR_LEVEL;
    }

//    // Product를 Floor에 추가하는 메서드
//    @Override
//    public String toString() {
//        return "Floor{" +
//                "floorId=" + floorId +
//                ", location=" + location +
//                ", floorLevel=" + floorLevel +
//                ", product=" + product +
//                '}';
//    }
}
