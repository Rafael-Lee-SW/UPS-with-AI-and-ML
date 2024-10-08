package com.a302.wms.domain.floor.entity;

import static com.a302.wms.global.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "floor")
public class Floor extends BaseTimeEntity {

  private static final Logger log = LoggerFactory.getLogger(Floor.class);

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long floorId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "location_id", nullable = false)
  private Location location;

  @Column(nullable = false)
  private int floorLevel;

  @OneToMany(mappedBy = "floor")
  private List<Product> productList = new ArrayList<>();

  @Builder
  public Floor(Integer floorLevel, Long floorId, Location location, List<Product> productList) {
    this.floorLevel = floorLevel;
    this.floorId = floorId;
    this.location = location;
    this.productList = productList;
  }

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
  // Product를 Floor에 추가하는 메서드
  public void addProduct(Product product) {
    if (!this.productList.contains(product)) {
      this.productList.add(product);
    }
  }

  public void removeProduct(Product product) {
    if (this.productList.contains(product)) {
      this.productList.remove(product);
    }
  }

}
