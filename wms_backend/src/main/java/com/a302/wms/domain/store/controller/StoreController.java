package com.a302.wms.domain.store.controller;

import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.store.dto.store.StoreCreateRequest;
import com.a302.wms.domain.store.dto.store.StoreDetailResponseDto;
import com.a302.wms.domain.store.dto.store.StoreResponseDto;
import com.a302.wms.domain.store.dto.wall.WallCreateRequestList;
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
// TODO : userId 제거하고 토큰으로 받기
public class StoreController {

    private final StoreServiceImpl storeService;

    /**
     * userId에 해당하는 매장 생성
     * @param userId : 생성할 매장의 userId
     * @param storeCreateRequest : 생성할 매장의 정보가 담긴 dto
     * @return 생성한 매장의 정보
     */
    @PostMapping
    public BaseSuccessResponse<StoreResponseDto> save(
            @RequestParam Long userId,
            @RequestBody StoreCreateRequest storeCreateRequest) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(storeService.save(userId, storeCreateRequest));
    }

    /**
     * TODO : 이거 API 문서에 없는데 지울까요
     * userId를 통해 user의 모든 매장 목록을 불러옴
     * @param userId : 매장 목록을 찾을 userId
     * @return userId에 해당하는 모든 매장 목록
     */
    @GetMapping
    public BaseSuccessResponse<List<StoreResponseDto>> findByUserId(
            @RequestParam Long userId) {
        log.info("[Controller] find Stores");
        return new BaseSuccessResponse<>(storeService.findAllByUserId(userId));
    }

    /**
     * 특정 유저의 특정 매장에 대한 간단한 정보를 불러옴
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
     * 해당 매장의 벽을 생성
     *
     * @param wallCreateRequestList : 저장할 벽의 정보
     */
    @PostMapping("/{storeId}/structures/walls")
    public BaseSuccessResponse<Void> saveAllWall(
            @PathVariable Long storeId,
            @RequestBody WallCreateRequestList wallCreateRequestList
    ) {
        log.info("[Controller] save Walls");
        storeService.saveAllWall(wallCreateRequestList);
        return new BaseSuccessResponse<>(null);
    }

    @GetMapping("/{storeId}/products")
    public BaseSuccessResponse<List<ProductResponse>> findAllProducts(
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find all products for store");
        return new BaseSuccessResponse<>(storeService.findProducts(storeId));
    }

}
