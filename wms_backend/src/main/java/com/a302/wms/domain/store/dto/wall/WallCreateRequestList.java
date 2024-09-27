package com.a302.wms.domain.store.dto.wall;

import java.util.List;

public record WallCreateRequestList(
        Long storeId,
        List<WallCreateRequest> wallCreateDtos

) {
}
