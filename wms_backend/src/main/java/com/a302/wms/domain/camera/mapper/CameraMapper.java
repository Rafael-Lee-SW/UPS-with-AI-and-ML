package com.a302.wms.domain.camera.mapper;

import com.a302.wms.domain.camera.dto.CameraResponse;
import com.a302.wms.domain.camera.entity.Camera;

public class CameraMapper {

    public static CameraResponse toCameraResponse(Camera camera) {
        return CameraResponse.builder()
                .id(camera.getId())
                .url(camera.getUrl())
                .build();
    }
}
