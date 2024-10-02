package com.a302.wms.domain.store.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;


@Builder
public record StoreCreateRequest(
    @NotNull(message = "매장 크기를 적어주세요")
    int size,
    @NotNull(message = "매장명을 적어주세요")
    String storeName) {

}
