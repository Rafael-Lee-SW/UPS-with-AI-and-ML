package com.a508.wms.business.service;

import static com.a508.wms.business.mapper.BusinessMapper.toBusinessResponseDto;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.dto.BusinessRequestDto;
import com.a508.wms.business.dto.BusinessResponseDto;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.service.UserModuleService;
import com.a508.wms.util.constant.RoleTypeEnum;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessModuleService businessModuleService;
    private final UserModuleService userModuleService;

    /**
     * 사업체 생성 메서드
     *
     * @param request
     * @return
     */
    @Transactional
    public BusinessResponseDto create(Long userId, BusinessRequestDto request) {
        log.info("[Service] create Business by userId: {}", userId);
        Business.BusinessBuilder builder = Business.builder();

        User user = userModuleService.findById(userId);
        user.updateRoleTypeEnum(RoleTypeEnum.BUSINESS); //Business 등록하면서 유저 역할 변경
        builder.user(user);

        if (request.getName() != null) {
            builder.name(request.getName());
        }
        if (request.getBusinessNumber() != null) {
            builder.businessNumber(request.getBusinessNumber());
        }
        Business business = builder.build();
        try {
            Business savedBusiness = businessModuleService.save(business);
            user.updateBusinessId(savedBusiness.getId());
            // 비즈니스 ID 포함한 ResponseDto 반환
            return toBusinessResponseDto(savedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 특정 id를 가진 사업체의 정보를 조회하여 반환하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    public BusinessResponseDto findById(long id) {
        log.info("[Service] find Business by id: {}", id);
        try {
            Business business = businessModuleService.findById(id);
            return toBusinessResponseDto(business);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 수정하는 메서드 수정 가능한 부분은 사업체에 관한 개인 정보들(이름, 사업체번호)
     *
     * @param request : 사업체 정보가 담긴 Dto
     * @return BusinessDto
     */
    @Transactional
    public BusinessResponseDto update(Long id, BusinessRequestDto request) {
        log.info("[Service] update Business by id: {}", id);
        try {
            // 수정할 필드 값 변경하기
            Business updatedBusiness = businessModuleService.findById(id);
            updatedBusiness.updateName(request.getName());
            updatedBusiness.updateBusinessNumber(request.getBusinessNumber());
            updatedBusiness = businessModuleService.save(updatedBusiness);
            // 변경 후 return
            return toBusinessResponseDto(updatedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리 d delete시 유저의 Role과 함께 직원들의 관계도
     * 끊어줘야한다.
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    @Transactional
    public BusinessResponseDto delete(Long id) {
        try {
            log.info("[Service] delete Business by id: {}", id);
            Business existingBusiness = businessModuleService.findById(id);
            User user = existingBusiness.getUser();
            Business deletedBusiness = businessModuleService.delete(existingBusiness);
            user.updateRoleTypeEnum(RoleTypeEnum.GENERAL);

            List<User> employees = userModuleService.findByBusinessId(deletedBusiness.getId());
            for (User employee : employees) {
                employee.updateBusinessId(-1L);
                employee.updateRoleTypeEnum(RoleTypeEnum.GENERAL);
            }
            user.updateBusinessId(-1L);
            return toBusinessResponseDto(deletedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
