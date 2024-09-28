package com.a302.wms.domain.structure.dto.location;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class LocationListCreateRequest {
    private Long storeId;
    private List<LocationCreateRequest> requests;
}
