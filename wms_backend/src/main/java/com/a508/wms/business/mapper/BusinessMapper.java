package com.a508.wms.business.mapper;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.dto.BusinessRequestDto;
import com.a508.wms.business.dto.BusinessResponseDto;
import org.springframework.stereotype.Component;

@Component
public class BusinessMapper {

    /**
     * BusinessRequestDto를 받아와서 Business로 변환하는 메서드
     *
     * @param businessRequestDto
     * @return
     */
    public static Business fromBusinessRequestDto(BusinessRequestDto businessRequestDto) {
        return Business.builder()
            .name(businessRequestDto.getName())
            .businessNumber(businessRequestDto.getBusinessNumber())
            .build();
    }

    /**
     * Business Domain을 BusinessResponseDto로 변환하는 메서드
     *
     * @param business
     * @return
     */
    public static BusinessResponseDto toBusinessResponseDto(Business business) {
        return BusinessResponseDto.builder()
            .id(business.getId())
            .userId(business.getUser() == null ? -1 : business.getUser().getId())
            .name(business.getName())
            .businessNumber(business.getBusinessNumber())
            .createdDate(business.getCreatedDate())
            .updatedDate(business.getUpdatedDate())
            .statusEnum(business.getStatusEnum())
            .build();
    }
}