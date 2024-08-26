package com.a508.wms.floor.dto;

import com.a508.wms.util.constant.ExportTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class FloorRequestDto {

    private int floorLevel;
    private ExportTypeEnum exportTypeEnum;
}
