package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
public class ProductPickingDto implements Comparable<ProductPickingDto> {
    private String warehouseName;
    private String locationName;
    private int floorLevel;
    private Long productId;
    private String productName;
    private int quantity;
    private ProductStorageTypeEnum productStorageType;
    private Long warehouseId;
    private LocalDateTime expirationDate;

    @Override
    public int compareTo(ProductPickingDto other) {
        if (this.expirationDate == null && other.expirationDate == null) {
            return 0;
        }
        if (this.expirationDate == null) {
            return 1;
        }
        if (other.expirationDate == null) {
            return -1;
        }

        int expirationComparison = this.expirationDate.compareTo(other.expirationDate);
        if (expirationComparison != 0) {
            return expirationComparison;
        }

        return Integer.compare(other.quantity, this.quantity);
    }

}
