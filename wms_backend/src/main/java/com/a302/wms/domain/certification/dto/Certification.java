package com.a302.wms.domain.certification.dto;

import lombok.Builder;

@Builder
public record Certification(
        String email,
        String certificationNumber
) {
}
