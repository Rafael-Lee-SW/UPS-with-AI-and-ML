package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * User -> UserResponseDto
     *
     * @param user : 변환할 User 객체
     * @return : 변환된 Dto
     */
    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
            .id(user.getId())
            .name(user.getName())
            .userNumber(user.getUserNumber())
            .createdDate(user.getCreatedDate())
            .updatedDate(user.getUpdatedDate())
            .build();
    }
}