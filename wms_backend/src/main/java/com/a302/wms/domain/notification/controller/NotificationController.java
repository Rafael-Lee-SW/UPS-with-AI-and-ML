package com.a302.wms.domain.notification.controller;

import com.a302.wms.domain.notification.service.NotificationServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationServiceImpl notificationServiceImpl;

    @GetMapping
    public BaseSuccessResponse<?> getNotifications(@AuthenticationPrincipal Long userId,
                                                   @RequestParam(required = false) Long storeId,
                                                   @RequestParam(required = false) String type,
                                                   @RequestParam(name = "isRead", required = false) Boolean isRead) {
        if (storeId != null) {
            if (type != null) {
                if (isRead != null) {
                    log.info("[Controller] getNotifications by storeId : {}, type : {}, isRead : {}", storeId, type, isRead);
                    return new BaseSuccessResponse<>(notificationServiceImpl.findAllByStoreIdAndTypeAndIsRead(storeId, type, isRead));
                }
                log.info("[Controller] getNotifications by storeId : {}, type : {}", storeId, type);
                return new BaseSuccessResponse<>(notificationServiceImpl.findAllByStoreIdAndType(storeId, type));
            } else {
                log.info("[Controller] getNotifications by storeId : {}", storeId);
                return new BaseSuccessResponse<>(notificationServiceImpl.findAllByStoreId(storeId));
            }
        } else if (type != null) {

            if (isRead != null) {
                log.info("[Controller] getNotifications by userId : {}, type : {}, isRead : {}", userId, type, isRead);
                return new BaseSuccessResponse<>(notificationServiceImpl.findAllByUserIdAndTypeAndIsRead(userId, type, isRead));
            } else {
                log.info("[Controller] getNotifications by userId : {}, type : {}", userId, type);
                return new BaseSuccessResponse<>(notificationServiceImpl.findAllByUserIdAndType(userId, type));
            }
        } else {
            log.info("[Controller] getNotifications by userId : {}", userId);
            return new BaseSuccessResponse<>(notificationServiceImpl.findAllByUserId(userId));
        }
    }
}
