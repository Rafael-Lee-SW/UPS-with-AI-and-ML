package com.a302.wms.domain.product.entity;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")

public class Product extends BaseTimeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long productId;

  @Column(name = "sku")
  private String sku;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "floor_id")
  private Floor floor;

  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "store_id", nullable = false)
  private Store store;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @Column(name = "barcode", nullable = false)
  private Long barcode;

  @Column(name = "product_name", nullable = false)
  private String productName;

  @Column(name = "original_price")
  private Integer originalPrice;

  @Column(name = "selling_price")
  private Integer sellingPrice;

  @Builder
  public Product(
      Long barcode,
      Floor floor,
      Integer originalPrice,
      Long productId,
      String productName,
      Integer quantity,
      Integer sellingPrice,
      String sku,
      Store store) {
    this.barcode = barcode;
    this.floor = floor;
    this.originalPrice = originalPrice;
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.sellingPrice = sellingPrice;
    this.sku = sku;
    this.store = store;
  }

  public void updateQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public void updateBarcode(Long barcode) {
    this.barcode = barcode;
  }

  public void updateProductName(String productName) {
    this.productName = productName;
  }

  public void updateOriginalPrice(Integer originalPrice) {
    this.originalPrice = originalPrice;
  }

  public void updateSellingPrice(Integer sellingPrice) {
    this.sellingPrice = sellingPrice;
  }

  public void updateSku(String sku) {
    this.sku = sku;
  }
  public void updateFloor(Floor newFloor) {
    this.floor = newFloor;
  }

  @Override
  public String toString() {
    return "Product{"
            +"floor.id: " + floor.getFloorId() +
            "barcode=" + barcode +
            ", productId=" + productId +
            ", sku='" + sku + '\'' +
            ", store=" + store +
            ", quantity=" + quantity +
            ", productName='" + productName + '\'' +
            ", originalPrice=" + originalPrice +
            ", sellingPrice=" + sellingPrice +
            '}';
  }
}