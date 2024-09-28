package com.a302.wms.domain.structures.dto.location;

import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;

import java.util.List;

public record LocationListCreateRequest(
        Long storeId,
        List<LocationCreateRequest> locationList
) {
}
