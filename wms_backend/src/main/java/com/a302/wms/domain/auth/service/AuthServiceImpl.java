package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.DeviceSignInRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.AccessTokenResponse;
import com.a302.wms.domain.auth.mapper.AuthMapper;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.certification.provider.EmailProvider;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.TokenRoleTypeEnum;
import io.lettuce.core.RedisException;
import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final EmailProvider emailProvider;
    //    private final CertificationRepository certificationRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스
    private final OtpServiceImpl otpService;
//    private final CertificationRedisRepository certificationRedisRepository;


    public String deviceSignIn(DeviceSignInRequest deviceOtpSingInRequest) {
        Long deviceId = otpService.verifyDeviceOtp(deviceOtpSingInRequest.deviceOtp());
        return deviceId.toString();
    }

    public AccessTokenResponse signIn(SignInRequest signInRequest) {
        log.info("[Service] signIn request: {}", signInRequest);
        try {
            String userEmail = signInRequest.email();
            User user = userRepository.findByEmail(userEmail).orElseThrow();

            String password = signInRequest.password();
            String encodedPassword = passwordEncoder.encode(password);
            if (passwordEncoder.matches(user.getPassword(), encodedPassword)) {
                throw new AuthException();
            }

            String accessToken = jwtProvider.create(TokenRoleTypeEnum.USER, user.getId().toString());
            String refreshToken = UUID.randomUUID().toString();

            //TODO redis 저장

            return AuthMapper.fromAccessToken(accessToken);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RedisException("JWT 토큰 저장에 실패했습니다.");
        }
    }


}


