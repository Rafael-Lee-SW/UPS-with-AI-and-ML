package com.a302.wms.domain.user.dto;

import com.a302.wms.global.constant.SocialLoginTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Builder
public record UserResponseDto(

        Long id,
        String email,
        String userName,
        SocialLoginTypeEnum loginTypeEnum,
        LocalDateTime createdDate

) {

}
