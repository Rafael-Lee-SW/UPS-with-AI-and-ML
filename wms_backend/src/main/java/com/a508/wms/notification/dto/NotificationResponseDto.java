package com.a508.wms.notification.dto;

import com.a508.wms.product.dto.ExpirationProductResponseDto;
import com.a508.wms.product.dto.ProductFlowResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class NotificationResponseDto {

    private List<ProductFlowResponseDto> productFlowResponseDtos;
    private List<ExpirationProductResponseDto> expirationProductResponseDtos;
}
