package com.a302.wms.domain.notification.controller;

import com.a302.wms.domain.notification.service.NotificationServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationServiceImpl notificationServiceImpl;

    @GetMapping("/{storeId}")
    public BaseSuccessResponse<?> findAllByStoreIdAndType(@PathVariable("storeId") Long storeId,
                                                     @RequestParam(value = "type", required = false) String type) {
        if (type != null)
        return new BaseSuccessResponse<>(notificationServiceImpl.findAllByStoreIdAndType(storeId,type));
        else if(storeId != null)
            return new BaseSuccessResponse<>(notificationServiceImpl.findAllByStoreId(storeId));
        else return null;
    }
    @GetMapping("/{storeId}/not-read")
    public BaseSuccessResponse<?> findAllNotReadByStoreId(@PathVariable("storeId") Long storeId) {
        return new BaseSuccessResponse<>(notificationServiceImpl.findAllNotReadByStoreId(storeId));

    }
}
