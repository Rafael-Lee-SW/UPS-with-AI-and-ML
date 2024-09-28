package com.a302.wms.domain.structure.dto;

import com.a302.wms.domain.structure.dto.location.LocationCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallCreateRequest;

import java.util.List;

public record StructureDeleteRequest(
        List<Long> locationDeleteList,
        List<Long> wallDeleteList) {
}
