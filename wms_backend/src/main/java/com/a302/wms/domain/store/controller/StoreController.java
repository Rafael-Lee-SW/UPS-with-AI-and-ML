package com.a302.wms.domain.store.controller;

import com.a302.wms.domain.store.dto.store.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.store.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.store.StoreResponseDto;
import com.a302.wms.domain.store.dto.wall.WallsCreateDto;
import com.a302.wms.domain.store.service.StoreServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/stores")
public class StoreController {

    private StoreServiceImpl storeService;

    /**
     * 사업자 id의 창고를 저장 POST 방식
     */
    @PostMapping
    public BaseSuccessResponse<StoreResponseDto> save(
            @RequestParam Long userId,
            @RequestBody StoreCreateRequestDto storeDto) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(storeService.save(userId, storeDto));
    }

    /**
     * 비지니스 id로 창고 조회 GET 방식
     */
    @GetMapping
    public BaseSuccessResponse<List<StoreResponseDto>> findByUserId(
            @RequestParam Long userId) {
        log.info("[Controller] find Stores by userId: {}", userId);
        return new BaseSuccessResponse<>(storeService.findByUserId(userId));
    }

    @GetMapping("/{storeId}")
    public BaseSuccessResponse<StoreDetailResponseDto> findById(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find Store by id: {}", storeId);
        return new BaseSuccessResponse<>(storeService.findById(userId, storeId));
    }

    /*
   창고 id의 상태를 비활성화 (status를 0으로 변경) PATCH 방식
   */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> delete(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        log.info("[Controller] delete Store by id: {}", id);
        storeService.delete(userId, id);
        return new BaseSuccessResponse<>(null);
    }

    @PostMapping("/walls")
    public BaseSuccessResponse<Void> saveAllWall(
            @RequestBody WallsCreateDto dto
    ) {
        log.info("[Controller] save Walls: ");
        storeService.saveAllWall(dto);
        return new BaseSuccessResponse<>(null);
    }
}
