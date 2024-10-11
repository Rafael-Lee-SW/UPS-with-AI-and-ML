package com.a302.wms.domain.payment.dto;

import java.util.List;

public record OrderCreateRequest(
        String orderId,
        Long totalPrice,
        List<PaymentCreateRequest> paymentCreateRequestList
) {
}
