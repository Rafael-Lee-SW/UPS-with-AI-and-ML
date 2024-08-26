package com.a508.wms.product.dto;

public interface ProductQuantityDto {

    Long getBarcode();

    Integer getPossibleQuantity();

    Integer getMovableQuantity();
}
