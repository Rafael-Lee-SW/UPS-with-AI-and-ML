package com.a302.wms.domain.camera.dto;

import lombok.Builder;

@Builder
public record CameraResponse(Long id,
                             String url) {
}
