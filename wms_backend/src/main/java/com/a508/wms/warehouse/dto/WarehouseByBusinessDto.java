package com.a508.wms.warehouse.dto;

import com.a508.wms.util.constant.FacilityTypeEnum;
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
public class WarehouseByBusinessDto {

    private Long id;
    private Long businessId;
    private int size;
    private String name;
    private int rowCount;
    private int columnCount;
    private int priority;
    private FacilityTypeEnum facilityTypeEnum;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;

}
