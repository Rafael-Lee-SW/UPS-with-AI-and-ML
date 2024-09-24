package com.a302.wms.domain.product.entity;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.domain.store.entity.Store;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long productId;

    @Column(name = "sku", nullable = false)
    private String sku;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "expiration_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expirationDate;

    @Column(name = "barcode", nullable = false)
    private Long barcode;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "original_price")
    private Integer originalPrice;

    @Column(name = "selling_price")
    private Integer sellingPrice;

    @Builder
    public Product(Floor floor, Store store, Integer quantity,
                   LocalDateTime expirationDate, Long barcode,
                   String productName, Integer originalPrice,
                   Integer sellingPrice) {
        this.floor = floor;
        this.store = store;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.barcode = barcode;
        this.productName = productName;
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }
    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public void updateExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
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

    public void updateFloor(Floor floor) {
        this.floor = floor;
        floor.updateProduct(this);
    }
}