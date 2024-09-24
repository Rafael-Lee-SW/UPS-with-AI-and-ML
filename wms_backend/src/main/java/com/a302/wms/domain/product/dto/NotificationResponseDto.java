package com.a302.wms.domain.product.dto;

import lombok.Builder;

import java.util.List;

public record NotificationResponseDto(List<ProductFlowResponseDto> productFlowResponseDtos) {

    @Builder

    public NotificationResponseDto(List<ProductFlowResponseDto> productFlowResponseDtos) {
        this.productFlowResponseDtos = productFlowResponseDtos;
    }
}
