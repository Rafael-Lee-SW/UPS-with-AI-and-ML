package com.a302.wms.domain.payment.dto;

import java.time.LocalDateTime;

public record PaymentCreateRequest(
    Long storeId,
    Long paidAmount,
    Long totalAmount,
    LocalDateTime paidAt
) {
}
