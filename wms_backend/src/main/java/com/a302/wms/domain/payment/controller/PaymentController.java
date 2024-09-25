package com.a302.wms.domain.payment.controller;

import com.a302.wms.domain.payment.dto.PaymentCreateRequestDto;
import com.a302.wms.domain.payment.dto.PaymentResponseDto;
import com.a302.wms.domain.payment.dto.PaymentSearchRequestDto;
import com.a302.wms.domain.payment.service.PaymentServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private PaymentServiceImpl paymentService;

    /**
     * TODO : JavaDoc 작성
     * @param deviceId
     * @param dto
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<PaymentResponseDto> save(
            @RequestParam Long deviceId,
            @RequestBody PaymentCreateRequestDto dto
    ) {
        log.info("[Controller] save payment for device in store");

        return new BaseSuccessResponse<>(paymentService.save(deviceId, dto));
    }

    @GetMapping("/{paymentId}")
    public BaseSuccessResponse<PaymentResponseDto> get(
            @RequestParam Long userId,
            @PathVariable Long paymentId
    ) {
        log.info("[Controller] get payment for user by paymentId");

        return new BaseSuccessResponse<>(paymentService.findById(userId, paymentId));
    }

    /**
     * TODO : JavaDoc 작성
     * @param userId
     * @param dto
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<PaymentResponseDto>> find(
            @RequestParam Long userId,
            @RequestBody PaymentSearchRequestDto dto
    ) {
        log.info("[Controller] find payments of store ");

        return new BaseSuccessResponse<>(paymentService.find(userId, dto));
    }
}
