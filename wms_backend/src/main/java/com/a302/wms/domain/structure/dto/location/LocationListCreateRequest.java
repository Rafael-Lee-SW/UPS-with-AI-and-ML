package com.a302.wms.domain.structure.dto.location;

import lombok.Builder;

import java.util.List;

@Builder
public record LocationListCreateRequest(
        Long storeId,
        List<LocationCreateRequest> requests

) {
}
