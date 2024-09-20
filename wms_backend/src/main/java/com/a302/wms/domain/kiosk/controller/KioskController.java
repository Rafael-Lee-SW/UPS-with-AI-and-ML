package com.a302.wms.domain.kiosk.controller;

import com.a302.wms.domain.kiosk.dto.KioskCreateRequestDto;
import com.a302.wms.domain.kiosk.dto.KioskDeleteRequestDto;
import com.a302.wms.domain.kiosk.dto.KioskKeyResponseDto;
import com.a302.wms.domain.kiosk.dto.KioskResponseDto;
import com.a302.wms.domain.kiosk.service.KioskServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/kiosks")
@Tag(name = "키오스크 관리", description = "키오스크 관련 API")
public class KioskController {

    // TODO interface 추출 후 변경
    private final KioskServiceImpl kioskService;

    /**
     * 유저에 속한 매장에 대한 키오스크 전체를 반환합니다.
     * @param userId
     * @return
     */
    @GetMapping
    @Operation(summary = "키오스크 목록 조회 (키값 제외)", tags = { "키오스크 관리" })
    public BaseSuccessResponse<List<List<KioskResponseDto>>> getUserKiosksList(
            @RequestParam(required = true) Long userId
    ) {
        log.info("[Controller] get kiosks list of the user: {}", userId);
        return new BaseSuccessResponse<>(kioskService.getUserKiosksList(userId));
    }

    /**
     * 특정 키오스크의 키를 포함한 정보를 반환합니다.
     * @param userId
     * @param kioskId
     * @return
     */
    @GetMapping("/{kioskId}")
    @Operation(summary = "키오스크 키 조회", tags = { "키오스크 관리" })
    public BaseSuccessResponse<KioskKeyResponseDto> getKioskKey(
            @RequestParam(required = true) Long userId,
            @PathVariable(required = true) Long kioskId
    ) {
        log.info("[Controller] get kiosk key of the kiosk: {}", kioskId);
        return new BaseSuccessResponse<>(kioskService.getKioskKey(userId, kioskId));
    }


    /**
     * 키오스크를 새로 생성합니다.
     * @param userId
     * @param requestDto
     * @return
     */
    @PostMapping
    @Operation(summary = "키오스크 등록", tags = { "키오스크 관리" })
    public BaseSuccessResponse<KioskResponseDto> saveKiosk(
            @RequestParam(required = true) Long userId,
            @RequestBody(required = true) KioskCreateRequestDto requestDto
    ) {
        log.info("[Controller] create kiosk for the store: {}", requestDto.storeId());
        return new BaseSuccessResponse<>(kioskService.saveKiosk(userId, requestDto));
    }

    /**
     * 키오스크를 삭제합니다.
     * @param userId
     * @param requestDto
     * @return
     */
    @PostMapping("/{kioskId}")
    @Operation(summary = "키오스크 삭제", tags = { "키오스크 관리" })
    public BaseSuccessResponse<Void> deleteKiosk(
            @RequestParam(required = true) Long userId,
            @PathVariable Long kioskId,
            @RequestBody(required = true) KioskDeleteRequestDto requestDto
    ) {
        log.info("[Controller] delete kiosk for the store: {}", requestDto.kioskId());
        kioskService.deleteKiosk(userId, requestDto);
        return new BaseSuccessResponse<>(null);
    }
}
