package com.a508.wms.floor.dto;

import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
