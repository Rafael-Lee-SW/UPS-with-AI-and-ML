package com.a302.wms.domain.auth.dto.response;

import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.product.dto.ProductResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record DeviceSignInResponse(
        String accessToken,
        DeviceResponse deviceResponse,
        List<ProductResponse> productResponseList,
        String storeName
) {
}
