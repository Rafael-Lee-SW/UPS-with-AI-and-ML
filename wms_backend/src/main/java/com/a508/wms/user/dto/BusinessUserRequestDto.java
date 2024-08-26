package com.a508.wms.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class BusinessUserRequestDto {
    private Long userId;
    private Long businessId;
}
