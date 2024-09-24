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
     * user에 대한 매장 생성
     * @param userId
     * @param storeDto
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<StoreResponseDto> save(
            @RequestParam Long userId,
            @RequestBody StoreCreateRequestDto storeDto) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(storeService.save(userId, storeDto));
    }

    /**
     * userId를 통해 user의 모든 매장 목록을 불러옴
     * @param userId
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<StoreResponseDto>> findByUserId(
            @RequestParam Long userId) {
        log.info("[Controller] find Stores by userId: {}", userId);
        return new BaseSuccessResponse<>(storeService.findByUserId(userId));
    }

    /**
     * storeId로 해당 매장의 세부 정보를 불러옴
     * @param userId
     * @param storeId
     * @return
     */
    @GetMapping("/{storeId}")
    public BaseSuccessResponse<StoreDetailResponseDto> findById(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find Store by id: {}", storeId);
        return new BaseSuccessResponse<>(storeService.findById(userId, storeId));
    }


    /**
     * store 삭제
     * @param userId
     * @param storeId
     * @return
     */
    @PatchMapping("/{storeId}")
    public BaseSuccessResponse<Void> delete(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] delete Store by storeId: {}", storeId);
        storeService.delete(userId, storeId);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * Store에 대한 벽 정보 저장
     * @param dto
     * @return
     */
    @PostMapping("/walls")
    public BaseSuccessResponse<Void> saveAllWall(
            @RequestBody WallsCreateDto dto
    ) {
        log.info("[Controller] save Walls: ");
        storeService.saveAllWall(dto);
        return new BaseSuccessResponse<>(null);
    }
}
