package com.a302.wms.domain.payment.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PaymentResponse(
        Long id,
        Long storeId,
        String orderId,
        Long barcode,
        Integer quantity,
        Long sellingPrice,
        String productName,
        LocalDateTime createdDate
) {
}
