package com.a508.wms.product.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class ProductExportRequestDto {

    private Long businessId;
    private Long warehouseId;
    private List<ExportResponseDto> data;


}
