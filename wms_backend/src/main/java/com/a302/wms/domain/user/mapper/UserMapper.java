package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .loginTypeEnum(user.getSocialLoginType())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public static User toEntity(UserSignUpRequest dto, String hashedPassword) {
        return User.builder()
                .username(dto.username())
                .password(hashedPassword)  // 암호화된 비밀번호 저장
                .email(dto.email())
                .build();
    }
}