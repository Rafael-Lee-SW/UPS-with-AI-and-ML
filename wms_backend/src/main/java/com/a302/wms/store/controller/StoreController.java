package com.a302.wms.store.controller;

import com.a302.wms.floor.exception.FloorException;
import com.a302.wms.global.response.BaseSuccessResponse;
import com.a302.wms.store.dto.*;
import com.a302.wms.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/stores")
public class StoreController {

    //의존성주입
    private final StoreService warehouseService;

    /**
     * 사업자 id의 매장를 저장 POST 방식
     */
    @PostMapping
    public BaseSuccessResponse<StoreRequestDto> save(
        @RequestBody StoreRequestDto storeRequestDto) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(warehouseService.save(storeRequestDto));
    }

    /**
     * 비지니스 id로 매장 조회 GET 방식
     */
    @GetMapping
    public BaseSuccessResponse<List<StoreByUserDto>> findAllByUserId(
        @RequestParam Long userId) {
        log.info("[Controller] find Stores by userId: {}", userId);
        return new BaseSuccessResponse<>(warehouseService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public BaseSuccessResponse<StoreDetailResponseDto> findById(@PathVariable Long id) throws FloorException {
        log.info("[Controller] find Store by productId: {}", id);
        return new BaseSuccessResponse<>(warehouseService.findById(id));
    }

    /*
   매장 id의 상태를 비활성화 (status를 0으로 변경) PATCH 방식
   */
    @DeleteMapping("/{id}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long id) {
        log.info("[Controller] delete Store by productId: {}", id);
        warehouseService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

    @PostMapping("/walls")
    public BaseSuccessResponse<Void> saveAllWall(@RequestBody WallRequestDto request) {
        log.info("[Controller] save Walls: ");
        warehouseService.saveAllWall(request);
        return new BaseSuccessResponse<>(null);
    }

}
