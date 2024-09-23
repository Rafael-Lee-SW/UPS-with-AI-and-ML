package com.a302.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

public record NotificationResponseDto(List<ProductFlowResponseDto> productFlowResponseDtos) {

    @Builder

    public NotificationResponseDto(List<ProductFlowResponseDto> productFlowResponseDtos) {
        this.productFlowResponseDtos = productFlowResponseDtos;
    }
}
