package com.a302.wms.domain.payment.mapper;

import com.a302.wms.domain.payment.dto.PaymentCreateRequest;
import com.a302.wms.domain.payment.dto.PaymentResponse;
import com.a302.wms.domain.payment.entity.Payment;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    /**
     * PaymentCreateRequestDto -> Payment
     *
     * @param paymentCreateRequest : 변환할 Dto
     * @param store
     * @return 변환된 Payment 객체
     */
    public static Payment fromCreateRequestDto(PaymentCreateRequest paymentCreateRequest, Store store, String orderId, Long barcode, Long floorId) {
        return Payment.builder()
                .store(store)
                .orderId(orderId)
                .barcode(barcode)
                .sellingPrice(paymentCreateRequest.sellingPrice())
                .quantity(paymentCreateRequest.quantity())
                .productName(paymentCreateRequest.productName())
                .floorId(floorId)
                .build();
    }

    /**
     * Payment -> PaymentResponseDto
     *
     * @param payment : 변환할 Payment 객체
     * @return 변환될 PaymentResponseDto
     */
    public static PaymentResponse toResponseDto(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .storeId(payment.getStore().getId())
                .barcode(payment.getBarcode())
                .sellingPrice(payment.getSellingPrice())
                .quantity(payment.getQuantity())
                .orderId(payment.getOrderId())
                .productName(payment.getProductName())
                .createdDate(payment.getCreatedDate())
                .floorId(payment.getFloorId())
                .build();
    }
}
