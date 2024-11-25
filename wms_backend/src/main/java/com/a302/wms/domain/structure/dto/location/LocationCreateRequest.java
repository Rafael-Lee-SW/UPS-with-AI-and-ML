package com.a302.wms.domain.structure.dto.location;

import com.a302.wms.global.constant.LocationTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class LocationCreateRequest {

    private String name;
    @Builder.Default
    private int xPosition = -1;
    @Builder.Default
    private int yPosition = -1;
    @Builder.Default
    private int xSize = -1;
    @Builder.Default
    private int ySize = -1;
    @Builder.Default
    private int zSize = -1;
    @Builder.Default
    private int rotation = 0;
    @Builder.Default
    private LocationTypeEnum locationType = LocationTypeEnum.LOCATION;

}
