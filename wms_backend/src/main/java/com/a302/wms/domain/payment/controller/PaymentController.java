package com.a302.wms.domain.payment.controller;

import com.a302.wms.domain.payment.dto.OrderCreateRequest;
import com.a302.wms.domain.payment.dto.PaymentResponse;
import com.a302.wms.domain.payment.service.PaymentServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentServiceImpl paymentService;

    /**
     * 새 결제내역 생성
     *
     * @param deviceId
     * @param dto
     * @return
     */
    @PostMapping
    @Operation(summary = "새 결제내역 생성")
    public BaseSuccessResponse<List<PaymentResponse>> save(
            @AuthenticationPrincipal Long deviceId,
            @RequestBody OrderCreateRequest dto
    ) {
        log.info("[Controller] save payment for device in store: {}", deviceId);
        return new BaseSuccessResponse<>(paymentService.save(deviceId, dto));
    }

    /**
     * paymentId를 통해 해당 결제내역 상세정보 조회
     *
     * @param userId
     * @param paymentId
     * @return
     */
    @GetMapping("/{paymentId}")
    @Operation(summary = "paymentId를 통해 해당 결제내역 상세정보 조회")
    public BaseSuccessResponse<PaymentResponse> get(
            @RequestParam Long userId,
            @PathVariable Long paymentId
    ) {
        log.info("[Controller] get payment for user by paymentId");

        return new BaseSuccessResponse<>(paymentService.findById(userId, paymentId));
    }

    /**
     * 특정 매장의 특정 기간 내의 결제내역 모두 조회
     *
     * @param userId
     * @param storeId
     * @param startDateTime
     * @param endDateTime
     * @return
     */
    @GetMapping
    @Operation(summary = "특정 매장의 특정 기간 내의 결제내역 모두 조회")
    public BaseSuccessResponse<List<PaymentResponse>> find(
            @RequestParam Long userId,
            @RequestParam Long storeId,
            @RequestParam LocalDateTime startDateTime,
            @RequestParam LocalDateTime endDateTime
    ) {
        log.info("[Controller] find payments of store ");
        return new BaseSuccessResponse<>(paymentService.find(userId, storeId, startDateTime, endDateTime));
    }
}
