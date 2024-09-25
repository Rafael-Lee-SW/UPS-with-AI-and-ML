package com.a302.wms.domain.payment.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PaymentResponse(
        Long id,
        Long storeId,
        Long paidAmount,
        Long totalAmount,
        LocalDateTime paidAt
) {
}