package com.a508.wms.productdetail.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.Product;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "product_detail")
@SQLRestriction("status_enum = 'Active'")
public class ProductDetail extends BaseTimeEntity {

    @OneToMany(mappedBy = "productDetail")
    private final List<Product> products = new ArrayList<>();
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public ProductStorageTypeEnum productStorageType;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;
    @Column(nullable = false)
    private Long barcode;
    @Column(nullable = false)
    private String name;
    @Column
    private Integer size;
    @Column
    private Integer unit;
    @Column
    private Integer originalPrice;
    @Column
    private Integer sellingPrice;
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Builder
    public ProductDetail(Business business, ProductStorageTypeEnum productStorageType, Long barcode,
                         String name, int size, int unit, int originalPrice, int sellingPrice) {
        this.business = business;
        this.productStorageType = productStorageType;
        this.barcode = barcode;
        this.name = name;
        this.size = size;
        this.unit = unit;
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }

    public void setBusiness(Business business) {
        this.business = business;
        business.getProductDetails().add(this);
    }

    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void updateData(ProductStorageTypeEnum productStorageType
            , Long barcode, String name, int size, int unit
            , int originalPrice, int sellingPrice) {
        this.productStorageType = productStorageType;
        this.barcode = barcode;
        this.name = name;
        this.size = size;
        this.unit = unit;
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }
}
