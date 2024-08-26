package com.a508.wms.user.mapper;

import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.business.mapper.BusinessMapper;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.RoleTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import static com.a508.wms.util.constant.ProductConstant.DEFAULT_BUSINESS_ID;

@Component
public class UserMapper {

    public static User fromSignUpRequestDto(SignUpRequestDto dto) {
        return User.builder()
            .email(dto.getEmail())
            .password(dto.getPassword())
            .name(dto.getName())
            .nickname(dto.getNickname())
            .roleTypeEnum(RoleTypeEnum.GENERAL) // 기본값 설정
            .loginTypeEnum(LoginTypeEnum.GENERAL) // 기본값 설정
            .statusEnum(StatusEnum.ACTIVE) // 기본값 설정
            .businessId(null) // businessId는 null로 설정
            .build();
    }

    /**
     * User 객체를 받아서 UserDto 객체로 변환해주는 메서드
     *
     * @param user
     * @return UserDto
     */
    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .nickname(user.getNickname())
            .roleTypeEnum(user.getRoleTypeEnum())
            .loginTypeEnum(user.getLoginTypeEnum())
            .statusEnum(user.getStatusEnum())
            .businessId((user.getBusinessId() == null) ? DEFAULT_BUSINESS_ID : user.getBusinessId())
            .businessAddDate(user.getBusinessAddDate())
            .build();
    }

    /**
     * OAuth 사용자 정보를 기반으로 User 객체 생성
     *
     * @param email
     * @param oauthClientName
     * @param attributes
     * @return User 객체
     */
    public static User fromOAuthAttributes(String email, String oauthClientName,
        Map<String, Object> attributes) {
        String name = null;
        String nickname = null;

        // OAuth 공급자에 따라 사용자 정보 추출
        switch (oauthClientName.toLowerCase()) {
            case "kakao":
                name = getKakaoName(attributes);
                nickname = name; // 카카오는 별명이 이름과 같다고 가정
                break;
            case "naver":
                name = getNaverName(attributes);
                nickname = getNaverNickname(attributes);
                break;
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + oauthClientName);
        }

        return User.builder()
            .email(email)
            .password("") // 소셜 로그인에서는 비밀번호가 필요하지 않음
            .name(name)
            .nickname(nickname)
            .roleTypeEnum(RoleTypeEnum.GENERAL) // 기본 역할 설정
            .loginTypeEnum(LoginTypeEnum.valueOf(oauthClientName.toUpperCase())) // OAuth 공급자로 로그인 타입 설정
            .statusEnum(StatusEnum.ACTIVE) // 기본 상태 설정
            .businessId(null)
            .build();
    }

    // 카카오 사용자 이름 추출 메서드
    private static String getKakaoName(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount != null) {
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            if (profile != null) {
                return (String) profile.get("nickname");
            }
        }
        return null;
    }

    // 네이버 사용자 이름 추출 메서드
    private static String getNaverName(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        if (response != null) {
            return (String) response.get("name");
        }
        return null;
    }

    // 네이버 사용자 별명 추출 메서드
    private static String getNaverNickname(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        if (response != null) {
            return (String) response.get("nickname");
        }
        return null;
    }
    
}
