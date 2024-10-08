package com.a302.wms.domain.payment.dto;

public record PaymentCreateRequest(
        Long barcode,
        Integer quantity,
        Long sellingPrice,
        String productName
) {
}
