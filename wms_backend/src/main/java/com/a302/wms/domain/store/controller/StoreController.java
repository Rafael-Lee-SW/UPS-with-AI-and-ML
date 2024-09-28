package com.a302.wms.domain.store.controller;

import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.service.ProductServiceImpl;
import com.a302.wms.domain.store.dto.StoreCreateRequestDto;
import com.a302.wms.domain.store.dto.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.StoreResponseDto;
import com.a302.wms.domain.structure.dto.wall.WallsCreateDto;
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

    private final ProductServiceImpl productServiceImpl;
    private final StoreServiceImpl storeService;

    /**
     * userId에 해당하는 매장 생성
     * @param userId : 생성할 매장의 userId
     * @param storeCreateRequestDto : 생성할 매장의 정보가 담긴 dto
     * @return 생성한 매장의 정보
     */
    @PostMapping
    public BaseSuccessResponse<StoreResponseDto> save(
            @RequestParam Long userId,
            @RequestBody StoreCreateRequestDto storeCreateRequestDto) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(storeService.save(userId, storeCreateRequestDto));
    }

    /**
     * userId를 통해 user의 모든 매장 목록을 불러옴
     * @param userId : 매장 목록을 찾을 userId
     * @return userId에 해당하는 모든 매장 목록
     */
    @GetMapping
    public BaseSuccessResponse<List<StoreResponseDto>> findByUserId(
            @RequestParam Long userId) {
        log.info("[Controller] find Stores");
        return new BaseSuccessResponse<>(storeService.findByUserId(userId));
    }

    /**
     * 특정 유저의 특정 매장에 대한 정보를 불러옴
     * @param userId : 찾을 매장의 userId
     * @param storeId : 찾을 매장의 id
     * @return 찾은 매장의 정보
     */
    @GetMapping("/{storeId}")
    public BaseSuccessResponse<StoreDetailResponseDto> findById(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find Store by id");
        return new BaseSuccessResponse<>(storeService.findById(userId, storeId));
    }


    /**
     * store 삭제
     * @param userId : 삭제할 매장의 userId
     * @param storeId : 삭제할 매장의 id
     */
    @PatchMapping("/{storeId}")
    public BaseSuccessResponse<Void> delete(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] delete Store by storeId");
        storeService.delete(userId, storeId);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 해당 매장의 모든 벽 정보를 저장
     * @param wallsCreateDto : 저장할 벽의 정보
     */
    @PostMapping("/walls")
    public BaseSuccessResponse<Void> saveAllWall(
            @RequestBody WallsCreateDto wallsCreateDto
    ) {
        log.info("[Controller] save Walls: ");
        storeService.saveAllWall(wallsCreateDto);
        return new BaseSuccessResponse<>(null);
    }

    @GetMapping("/{storeId}/products")
    public BaseSuccessResponse<List<ProductResponse>> findAllProducts(
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find all products for store: {}", storeId);
        return new BaseSuccessResponse<>(storeService.findProducts(storeId));
    }
}
