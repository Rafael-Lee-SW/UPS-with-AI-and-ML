package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * UserRequestDto를 받아와서 User로 변환하는 메서드
     *
     * @param userRequestDto
     * @return
     */
    public static User fromUserRequestDto(UserRequestDto userRequestDto) {
        return User.builder()
            .name(userRequestDto.getName())
            .userNumber(userRequestDto.getUserNumber())
            .build();
    }

    /**
     * User Domain을 UserResponseDto로 변환하는 메서드
     *
     * @param user
     * @return
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