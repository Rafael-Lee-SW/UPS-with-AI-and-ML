package com.a302.wms.store.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public record StoreByUserDto(
        Long id,
        Long userId,
        int size,
        String name,
        int rowCount,
        int columnCount,
        int priority,
        LocalDateTime createdDate,
        LocalDateTime updatedDate) {
    @Builder

    public StoreByUserDto(Long id,
                          Long userId,
                          int size,
                          String name,
                          int rowCount,
                          int columnCount,
                          int priority,
                          LocalDateTime createdDate,
                          LocalDateTime updatedDate) {
        this.id = id;
        this.userId = userId;
        this.size = size;
        this.name = name;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.priority = priority;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
