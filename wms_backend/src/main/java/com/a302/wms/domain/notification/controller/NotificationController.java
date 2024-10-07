package com.a302.wms.domain.notification.controller;

import com.a302.wms.domain.notification.dto.NotificationResponse;
import com.a302.wms.domain.notification.service.NotificationServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationServiceImpl notificationServiceImpl;

    @GetMapping("/{storeId}/{type}")
    public BaseSuccessResponse<?> findAllByStoreIdAndType(@PathVariable("storeId") Long storeId,
                                                     @PathVariable("type") String type) {
        return new BaseSuccessResponse<>(notificationServiceImpl.findAllCrimeByStoreId(storeId,type));

    }
}
