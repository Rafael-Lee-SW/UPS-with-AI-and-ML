package com.a302.wms.domain.payment.mapper;

import com.a302.wms.domain.payment.dto.PaymentCreateRequestDto;
import com.a302.wms.domain.payment.dto.PaymentResponseDto;
import com.a302.wms.domain.payment.entity.Payment;
import com.a302.wms.domain.store.entity.Store;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PaymentMapper {

    public static Payment fromCreateRequestDto(PaymentCreateRequestDto dto, Store store) {
        return Payment.builder()
                .store(store)
                .paidAmount(dto.paidAmount())
                .totalAmount(dto.totalAmount())
                .paidAt(LocalDateTime.now())
                .build();
    }

    public static PaymentResponseDto toResponseDto(Payment payment) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .storeId(payment.getStore().getId())
                .paidAmount(payment.getPaidAmount())
                .totalAmount(payment.getTotalAmount())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
