package com.a302.wms.domain.structure.dto.wall;

import java.util.List;

public record WallListCreateRequest(
        Long storeId,
        List<WallCreateRequest> wallCreateDtos

) {
}
