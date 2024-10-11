package com.a302.wms.domain.structure.dto;

import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;

import java.util.List;

public record StructureCreateRequest(
        List<LocationCreateRequest> locationCreateRequestList,
        List<WallCreateRequest> wallCreateRequestList
) {
}
