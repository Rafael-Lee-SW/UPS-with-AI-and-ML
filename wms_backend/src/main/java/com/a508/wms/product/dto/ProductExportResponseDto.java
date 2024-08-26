package com.a508.wms.product.dto;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ProductExportResponseDto {

    private Map<String, List<ExportResponseDto>> path;
}
