package com.a302.wms.domain.user.mapper;

import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.constant.SocialLoginTypeEnum;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .loginTypeEnum(user.getSocialLoginType())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public static User fromUserSignUpRequest(UserSignUpRequest dto, String hashedPassword, SocialLoginTypeEnum socialLoginType) {
        return User.builder()
                .userName(dto.userName())
                .password(hashedPassword)
                .socialLoginType(socialLoginType)
                .email(dto.email())
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
                .userName(name)
                .socialLoginType(SocialLoginTypeEnum.valueOf(oauthClientName.toUpperCase())) // OAuth 공급자로 로그인 타입 설정
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