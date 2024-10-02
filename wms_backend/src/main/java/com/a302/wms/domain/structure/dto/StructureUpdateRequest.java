package com.a302.wms.domain.structure.dto;

import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.location.LocationUpdateRequest;
import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallUpdateRequest;

import java.util.List;

public record StructureUpdateRequest(
        List<LocationUpdateRequest> locationUpdateRequestList,
        List<WallUpdateRequest> wallUpdateRequestList) {
}
