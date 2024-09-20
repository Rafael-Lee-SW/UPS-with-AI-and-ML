package com.a302.wms.floor.dto;

import com.a302.wms.util.constant.ExportTypeEnum;
import com.a302.wms.util.constant.StatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
public class FloorResponseDto {

    private Long id;
    private Long locationId;
    private int floorLevel;
    private ExportTypeEnum exportType;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;
}
