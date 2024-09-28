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
            if (passwordEncoder.matches(password, encodedPassword)) {
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


    /*public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        log.info("Received sign-up request for email: {}", dto.getEmail());
        try {
            String userEmail = dto.getEmail();
            boolean isExistEmail = userRepository.existsByEmail(userEmail);
            if (isExistEmail) {
                log.info("Email already exists: {}", userEmail);
                return SignUpResponseDto.duplicateId();
            }

            String email = dto.getEmail();
            Certification certificationEntity = certificationRedisRepository.findTopByEmailOrderByCreatedDateDesc(userEmail);

            if (certificationEntity == null) {
                log.info("No certification information found for email: {}", userEmail);
                return SignUpResponseDto.certificateFail();
            }


            // 암호화
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);
            log.info("Password encoded for email: {}", userEmail);

            // DTO를 User 엔티티로 변환
            User user = UserMapper.fromSignUpRequestDto(dto); // UserMapper를 통해 DTO를 User로 변환

            // User 엔티티 저장
            userRepository.save(user);

            log.info("User saved for email: {}", userEmail);

            // 인증 정보 삭제
            certificationRepository.delete(certificationEntity);
            log.info("Certification information deleted for email: {}", userEmail);

        } catch (Exception e) {
            log.error("An error occurred during sign-up for email: {}", dto.getEmail(), e);
            return ResponseDto.databaseError();
        }
        log.info("Sign-up successful for email: {}", dto.getEmail());
        return SignUpResponseDto.success();
    }

    *//**
     * 1.email 뽑아오기
     * 2.비밀번호 == encoding된 비밀번호
     * 3. 매치되면 jwtToken 생성
     * 4. 토큰담아서 response
     * @param dto
     * @return
     *//*
     *//**
     * 로그인 메서드
     *
     * @param dto : 로그인 요청 정보가 담긴 DTO
     * @return 로그인 결과가 담긴 응답 DTO
     *//*
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
        try {
            String userEmail = dto.getEmail();
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                return SignInResponseDto.signInFail(); // 사용자 없음 처리
            }

            String password = dto.getPassword();
            String encodedPassword = user.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) {
                return SignInResponseDto.signInFail(); // 비밀번호 불일치 처리
            }

            // JWT 토큰 생성
            String token = jwtProvider.create(userEmail);

            // 성공적인 로그인 응답 반환
            return SignInResponseDto.success(token, user);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError(); // 예외 처리
        }
    }*/
}


