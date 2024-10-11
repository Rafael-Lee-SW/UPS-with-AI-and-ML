package com.a302.wms.domain.camera.dto;

import java.time.LocalDateTime;
import lombok.Builder;

// 매장의 전체 방범 정보 조회 (notificationId,
// created_at, 방범 카테고리, videourl,
// isRead, isImportant 있어야 함)
// request:  storeId
@Builder
public record CameraResponse(
    Long id,
    Long notificationId,
    String title,
    String category,
    String url,
    LocalDateTime createdDate,
    Boolean isRead,
    Boolean isImportant) {}
