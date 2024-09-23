package com.a302.wms.store.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class WallRequestDto {
    private Long storeId;
    List<WallDto> wallDtos;
}
