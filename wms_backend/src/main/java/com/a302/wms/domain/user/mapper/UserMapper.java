package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserResponse toUserResponseDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .loginTypeEnum(user.getSocialLoginType())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public static User toEntity(UserSignUpRequest dto, String hashedPassword) {
        return User.builder()
                .userName(dto.userName())
                .password(hashedPassword)
                .email(dto.email())
                .build();
    }
}