package com.a302.wms.domain.user.dto;

import com.a302.wms.global.constant.SocialLoginTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
public record UserResponseDto(

        Long id,
        String email,
        String username,
        SocialLoginTypeEnum loginTypeEnum,
        LocalDateTime createdDate

) {

}
