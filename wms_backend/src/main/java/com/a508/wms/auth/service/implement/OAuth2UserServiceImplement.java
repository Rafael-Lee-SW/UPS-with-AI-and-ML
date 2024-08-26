package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.exception.DuplicatedEmailException;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        // OAuth2User 정보
        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName().toLowerCase();

        // 사용자 이메일 추출
        String email = extractEmail(oAuth2User.getAttributes(), oauthClientName);
        if (email == null) {
            throw new IllegalArgumentException("Email not found in user attributes");
        }

        // 이메일을 통해 사용자 조회
        Optional<User> existingUserOptional = userRepository.findByEmail(email);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            // 로그인 유형이 현재 OAuth2 요청과 일치하는지 확인
            if (existingUser.getLoginTypeEnum().name().equalsIgnoreCase(oauthClientName)) {
                // 이미 등록된 사용자라면 로그인 처리
                log.info("{} user logged in: {}", oauthClientName, email);
                return oAuth2User;
            } else {
                // 중복된 이메일 처리
                throw new DuplicatedEmailException("이미 가입된 이메일이 있습니다.");
            }
        } else {
            // 새로운 사용자 생성 및 저장
            log.info("New user registration: {}", email);
            User newUser = userMapper.fromOAuthAttributes(email, oauthClientName, oAuth2User.getAttributes());
            userRepository.save(newUser);
            return oAuth2User;
        }
    }

    /**
     * 사용자 정보를 기반으로 이메일 추출하는 메서드
     *
     * @param attributes
     * @param oauthClientName
     * @return 이메일
     */
    private String extractEmail(Map<String, Object> attributes, String oauthClientName) {
        String email = null;

        if ("kakao".equals(oauthClientName)) {
            Object kakaoAccountObj = attributes.get("kakao_account");
            if (kakaoAccountObj instanceof Map) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoAccountObj;
                email = (String) kakaoAccount.get("email");
            }
        } else if ("naver".equals(oauthClientName)) {
            Object responseObj = attributes.get("response");
            if (responseObj instanceof Map) {
                Map<String, Object> response = (Map<String, Object>) responseObj;
                email = (String) response.get("email");
            }
        }
        return email;
    }
}
