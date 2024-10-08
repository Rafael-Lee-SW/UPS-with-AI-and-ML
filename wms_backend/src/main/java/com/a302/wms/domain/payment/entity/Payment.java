package com.a302.wms.domain.payment.entity;

import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Payment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "barcode")
    private Long barcode;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "selling_price", nullable = false)
    private Long sellingPrice;

    @Builder
    public Payment(Store store, String orderId, Long barcode, Integer quantity, Long sellingPrice, String productName) {
        this.store = store;
        this.orderId = orderId;
        this.barcode = barcode;
        this.quantity = quantity;
        this.sellingPrice = sellingPrice;
        this.productName = productName;
    }
}
