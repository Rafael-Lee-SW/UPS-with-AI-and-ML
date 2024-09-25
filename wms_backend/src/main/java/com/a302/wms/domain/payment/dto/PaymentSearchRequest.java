package com.a302.wms.domain.payment.dto;

import java.time.LocalDateTime;

public record PaymentSearchRequest(
        Long storeId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime
) {
}
