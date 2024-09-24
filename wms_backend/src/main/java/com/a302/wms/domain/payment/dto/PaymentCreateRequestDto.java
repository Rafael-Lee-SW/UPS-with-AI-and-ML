package com.a302.wms.domain.payment.dto;

import java.time.LocalDateTime;

public record PaymentCreateRequestDto(
    Long storeId,
    Long paidAmount,
    Long totalAmount,
    LocalDateTime paidAt
) {
}
