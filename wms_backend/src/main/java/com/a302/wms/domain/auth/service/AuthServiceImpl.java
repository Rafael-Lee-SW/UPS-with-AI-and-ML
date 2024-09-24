package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.IdCheckResponseDto;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.certification.provider.EmailProvider;
import com.a302.wms.domain.certification.repository.CertificationRedisRepository;
import com.a302.wms.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
//    private final EmailProvider emailProvider;
//    private final CertificationRepository certificationRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스
//    private final CertificationRedisRepository certificationRedisRepository;

    /**
     * 사용자 이메일 중복 여부를 확인합니다.
     *
     * @param dto 사용자 이메일 체크 요청 DTO
     * @return 중복 여부에 따른 응답 엔터티
     */
    public ResponseEntity<? super IdCheckResponseDto> idCheck(EmailCertificationRequestDto dto) {
        log.info("idCheck method called with dto: {}", dto);
        try {
            // 사용자 이메일을 가져옴
            String email = dto.getEmail();
            log.info("Checking email for duplication: {}", email);

            // 사용자 이메일 중복 여부 확인
            boolean isExistEmail = userRepository.existsByEmail(email);
            if (isExistEmail) { // 중복이면
                log.info("Email already exists: {}", email);
                return IdCheckResponseDto.duplicateId();
            }
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email duplication check", e);
            return ResponseDto.databaseError();
        }
        // 중복이 아닌 경우 성공 응답 반환
        log.info("Email is available: {}", dto.getEmail());
        return IdCheckResponseDto.success();
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


