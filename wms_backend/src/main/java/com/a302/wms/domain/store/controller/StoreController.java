package com.a302.wms.domain.store.controller;

import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.service.ProductServiceImpl;
import com.a302.wms.domain.store.dto.StoreCreateRequest;
import com.a302.wms.domain.store.dto.StoreDetailResponse;
import com.a302.wms.domain.store.dto.StoreResponse;
import com.a302.wms.domain.store.dto.StoreUpdateRequest;
import com.a302.wms.domain.structure.dto.StructureCreateRequest;
import com.a302.wms.domain.structure.dto.StructureDeleteRequest;
import com.a302.wms.domain.structure.dto.StructureUpdateRequest;
import com.a302.wms.domain.structure.dto.location.LocationListCreateRequest;
import com.a302.wms.domain.structure.dto.wall.WallListCreateRequest;
import com.a302.wms.domain.store.service.StoreServiceImpl;
import com.a302.wms.domain.structure.service.StructureServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/stores")
public class StoreController {

    private final StoreServiceImpl storeService;

    /**
     * userId를 통해 user의 모든 매장 목록을 불러옴
     * @param userId : 매장 목록을 찾을 userId
     * @return userId에 해당하는 모든 매장 목록
     */
    @GetMapping
    @Operation(summary = "userId를 통해 user의 모든 매장 목록을 불러옴")
    public BaseSuccessResponse<List<StoreResponse>> findByUserId(
            @RequestParam Long userId) {
        log.info("[Controller] find Stores");
        return new BaseSuccessResponse<>(storeService.findByUserId(userId));
    }

    /**
     * userId에 해당하는 매장 생성
     * @param userId : 생성할 매장의 userId
     * @param storeCreateRequest : 생성할 매장의 정보가 담긴 dto
     * @return 생성한 매장의 정보
     */
    @PostMapping
    @Operation(summary = "userId에 해당하는 매장 생성")
    public BaseSuccessResponse<StoreResponse> save(
            @RequestParam Long userId,
            @RequestBody StoreCreateRequest storeCreateRequest) {
        log.info("[Controller] save Store");
        return new BaseSuccessResponse<>(storeService.save(userId, storeCreateRequest));
    }


    /**
     * 특정 유저의 특정 매장에 대한 정보를 불러옴
     * @param userId : 찾을 매장의 userId
     * @param storeId : 찾을 매장의 id
     * @return 찾은 매장의 정보
     */
    @GetMapping("/{storeId}")
    @Operation(summary = "특정 유저의 특정 매장에 대한 정보를 불러옴")
    public BaseSuccessResponse<StoreResponse> getStoreInfo(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find Store by id");
        return new BaseSuccessResponse<>(storeService.findById(storeId));
    }

    /**
     * 특정 매장의 정보를 UPDATE
     * @param userId
     * @param storeUpdateRequest
     * @return
     */
    @PatchMapping("/{storeId}")
    @Operation(summary = "특정 매장의 정보를 UPDATE")
    public BaseSuccessResponse<StoreResponse> updateStore(
            @RequestParam Long userId,
            @RequestBody StoreUpdateRequest storeUpdateRequest
    ) {
        log.info("[Controller] update Store: {}", storeUpdateRequest.storeId());
        return new BaseSuccessResponse<>(storeService.update(userId, storeUpdateRequest));
    }

    /**
     * 특정 매장의 세부 정보(벽, 로케이션 포함) 조회
     * @param storeId
     * @return
     */
    @GetMapping("/{storeId}/details")
    @Operation(summary = "특정 매장의 세부 정보(벽, 로케이션 포함) 조회")
    public BaseSuccessResponse<StoreDetailResponse> getStoreDetailInfo(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] get detailed info of the store {}", storeId);
        return new BaseSuccessResponse<>(storeService.findStoreDetailedInfo(userId,storeId));
    }


    /**
     * store 삭제
     * @param userId : 삭제할 매장의 userId
     * @param storeId : 삭제할 매장의 id
     */
    @DeleteMapping("/{storeId}")
    @Operation(summary = "store 삭제")
    public BaseSuccessResponse<Void> delete(
            @RequestParam Long userId,
            @PathVariable Long storeId
    ) {
        log.info("[Controller] delete Store by storeId");
        storeService.delete(userId, storeId);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 매장 구조를 생성
     * @param userId
     * @param structureCreateRequest
     * @return
     */
    @PostMapping("/{storeId}/structures")
    @Operation(summary = "매장 구조를 생성")
    public BaseSuccessResponse<Void> saveStructure(
            @RequestParam Long userId,
            @PathVariable Long storeId,
            @RequestBody StructureCreateRequest structureCreateRequest
    ) {
        log.info("[Controller] create store structure");

        storeService.saveStructure(userId,storeId, structureCreateRequest);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 매장 구조를 수정
     * @param userId
     * @param structureUpdateRequest
     * @return
     */
    @PatchMapping("/{storeId}/structures")
    @Operation(summary = "매장 구조를 수정")
    public BaseSuccessResponse<StoreDetailResponse> updateStructure(
            @RequestParam Long userId,
            @PathVariable Long storeId,
            @RequestBody StructureUpdateRequest structureUpdateRequest
    ) {
        log.info("[Controller] update store structure");

        storeService.updateStructure(userId,storeId, structureUpdateRequest);
        return new BaseSuccessResponse<>(null);
    }

    //TODO: 이 부분 StoreDetailResponse 주는 부분으로 대체해도 될 듯 합니다.
//    /**
//     * 매장구조를 조회
//     * @param userId
//     * @param storeId
//     * @return
//     */
//    @GetMapping("/{storeId}/structures")
//    public BaseSuccessResponse<StructureResponse> findStructure(
//            @RequestParam Long userId,
//            @PathVariable Long storeId
//    ) {
//        log.info("[Controller] find store structure");
//
//        return new BaseSuccessResponse<>(storeService.findStructure(userId, storeId));
//    }

    /**
     * 매장 구조 배치 삭제
     * @param userId
     * @param storeId
     * @param structureDeleteRequest
     * @return
     */
    @PostMapping("/{storeId}/structures/batch-delete")
    @Operation(summary = "매장 구조 배치 삭제")
    public BaseSuccessResponse<Void> deleteStructure(
            @RequestParam Long userId,
            @PathVariable Long storeId,
            @RequestBody StructureDeleteRequest structureDeleteRequest
    ) {
        log.info("[Controller] delete store structure");
        storeService.deleteStructure(userId, storeId, structureDeleteRequest);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 해당 매장의 모든 로케이션 정보를 저장
     * @param userId
     * @param locationListCreateRequest
     * @return
     */
    @PostMapping("/{storeId}/structures/locations")
    @Operation(summary = "해당 매장의 모든 로케이션 정보를 저장")
    public BaseSuccessResponse<Void> saveAllLocations(
            @RequestParam Long userId,
            @RequestBody LocationListCreateRequest locationListCreateRequest
    ){
        log.info("[Controller] save all locations: {}", locationListCreateRequest);
        storeService.saveAllLocations(userId, locationListCreateRequest);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 해당 매장의 모든 벽 정보를 저장
     * @param wallListCreateRequest : 저장할 벽의 정보
     */
    @PostMapping("/{storeId}/structures/walls")
    @Operation(summary = "해당 매장의 모든 벽 정보를 저장")
    public BaseSuccessResponse<Void> saveAllWalls(
            @RequestParam Long userId,
            @RequestBody WallListCreateRequest wallListCreateRequest
    ) {
        log.info("[Controller] save Walls: ");
        storeService.saveAllWall(userId, wallListCreateRequest);
        return new BaseSuccessResponse<>(null);
    }



    /**
     * 매장의 모든 상품 정보를 조회
     * @param storeId
     * @return
     */
    @GetMapping("/{storeId}/products")
    @Operation(summary = "매장의 모든 상품 정보를 조회")
    public BaseSuccessResponse<List<ProductResponse>> findAllProducts(
            @PathVariable Long storeId
    ) {
        log.info("[Controller] find all products for store: {}", storeId);
        return new BaseSuccessResponse<>(storeService.findProducts(storeId));
    }


}
