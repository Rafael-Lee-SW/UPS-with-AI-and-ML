package com.a302.wms.domain.structure.dto.wall;

import java.util.List;

public record WallsCreateDto (
        Long storeId,
        List<WallCreateRequestDto> wallCreateDtos

) {
}
