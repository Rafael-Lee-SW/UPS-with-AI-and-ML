package com.a508.wms.business.controller;

import com.a508.wms.business.dto.BusinessRequestDto;
import com.a508.wms.business.dto.BusinessResponseDto;
import com.a508.wms.business.service.BusinessService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/businesses")
@Tag(name = "사업체 관리", description = "사업체의 CRUD 관리")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<?> findById(@PathVariable Long id) {
        log.info("[Controller] find Business by id: {}", id);
        return new BaseSuccessResponse<>(businessService.findById(id));
    }

    /**
     * 사업체 생성 메서드
     *
     * @param userId
     * @param request
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<?> create(@RequestParam(name = "userId") Long userId,
        @RequestBody BusinessRequestDto request) {
        log.info("[Controller] create Business by userId: {}", userId);
        BusinessResponseDto responseDto = businessService.create(userId, request);
        return new BaseSuccessResponse<>(responseDto);
    }

    /**
     * 사업체의 정보를 수정하는 메서드 현재 수정 가능한 부분은 사업체에 관한 개인 정보들(사업체 번호, 이름,이메일 등..)
     *
     * @param id      : 사업체 고유 번호
     * @param request : 사업체 정보가 담긴 Dto
     * @return BusinessDto
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?> update(@PathVariable Long id,
        @RequestBody BusinessRequestDto request) {
        log.info("[Controller] update Business by id: {}", id);
        return new BaseSuccessResponse<>(businessService.update(id, request));
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<?> delete(@PathVariable Long id) {
        log.info("[Controller] delete Business by id: {}", id);
        return new BaseSuccessResponse<>(businessService.delete(id));
    }

}
