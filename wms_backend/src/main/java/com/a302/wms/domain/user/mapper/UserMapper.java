package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserResponseDto toUserResponse(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .loginTypeEnum(user.getSocialLoginType())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public static User fromUserSignUpRequest(UserSignUpRequest dto, String hashedPassword) {
        return User.builder()
                .userName(dto.userName())
                .password(hashedPassword)
                .email(dto.email())
                .build();
    }
}