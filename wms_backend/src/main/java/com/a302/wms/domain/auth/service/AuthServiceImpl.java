package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequest;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.IdCheckResponse;
import com.a302.wms.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final UserRepository userRepository;

    /**
     * 사용자 이메일 중복 여부를 확인합니다.
     *
     * @param dto 사용자 이메일 체크 요청 DTO
     * @return 중복 여부에 따른 응답 엔터티
     */
    public ResponseEntity<? super IdCheckResponse> idCheck(EmailCertificationRequest dto) {
        log.info("idCheck method called with dto");
        try {
            // 사용자 이메일을 가져옴
            String email = dto.getEmail();
            log.info("Checking email for duplication");

            // 사용자 이메일 중복 여부 확인
            boolean isExistEmail = userRepository.existsByEmail(email);
            if (isExistEmail) { // 중복이면
                log.error("Email already exists");
                return IdCheckResponse.duplicateId();
            }
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email duplication check", e);
            return ResponseDto.databaseError();
        }
        // 중복이 아닌 경우 성공 응답 반환
        log.info("Email is available");
        return IdCheckResponse.success();
    }

}


