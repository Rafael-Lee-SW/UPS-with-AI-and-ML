package com.a302.wms.domain.notification.dto;

import lombok.Builder;

@Builder
public record NotificationUpdateRequest(Long notificationId,
                                        Boolean isRead,
                                        Boolean isImportant) {
}
