package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.common.CertificationNumber;
import com.a508.wms.auth.domain.Certification;
import com.a508.wms.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.request.auth.SignInRequestDto;
import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.auth.dto.response.ResponseDto;
import com.a508.wms.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import com.a508.wms.auth.dto.response.auth.SignUpResponseDto;
import com.a508.wms.auth.provider.EmailProvider;
import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.auth.repository.CertificationRepository;
import com.a508.wms.auth.service.AuthService;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final JwtProvider jwtProvider;
    private final BusinessRepository businessRepository;
    private final EmailProvider emailProvider;
    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스

    /**
     * 사용자 이메일 중복 여부를 확인합니다.
     *
     * @param dto 사용자 이메일 체크 요청 DTO
     * @return 중복 여부에 따른 응답 엔터티
     */
    @Override
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

    /**
     * 이메일 인증을 처리합니다.
     *
     * @param dto 이메일 인증 요청 DTO
     * @return 이메일 인증 처리 결과 응답 엔터티
     */
    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        log.info("emailCertification method called with dto: {}", dto);
        try {
            // 이메일 주소 가져오기
            String email = dto.getEmail();
            log.info("Processing email certification for email: {}", email);

            // 인증 번호 생성
            String certificationNumber = CertificationNumber.getCertificationNumber();
            log.info("Generated certification number: {}", certificationNumber);

            if (certificationNumber == null || certificationNumber.isEmpty()) {
                log.error("Certification number generation failed");
                return EmailCertificationResponseDto.mailSendFail();
            }

            // 인증 이메일 발송
            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);

            if (!isSuccessed) {
                log.error("Failed to send certification email to: {}", email);
                return EmailCertificationResponseDto.mailSendFail();
            }

            // 인증 정보를 저장
            Certification certification = new Certification(email, certificationNumber);
            certificationRepository.save(certification);
            log.info("Saved certification info for email: {}", email);

        } catch (NumberFormatException e) {
            // 이메일이 유효하지 않은 경우 예외 처리
            log.error("Invalid email format: {}", dto.getEmail(), e);
            return ResponseDto.validationFail();
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email certification process", e);
            return ResponseDto.databaseError();
        }
        // 이메일 인증 성공 응답 반환
        log.info("Email certification succeeded for email: {}", dto.getEmail());
        return EmailCertificationResponseDto.success();
    }

    /**
     * checkCertification 메서드는 사용자가 입력한 인증 정보(사용자 ID, 이메일, 인증 번호)를 기반으로
     * 데이터베이스에 저장된 인증 정보와 비교하여 인증을 검증
     * @param dto
     * @return
     */

    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
        CheckCertificationRequestDto dto) {
            try {
                // 사용자 ID, 이메일, 인증 번호를 DTO로부터 가져옴
                String email = dto.getEmail();  // 이메일을 DTO로부터 가져옴
                String inputCertificationNumber = dto.getCertificationNumber();  // 인증 번호를 DTO로부터 가져옴

                log.info("Received certification check request for email: {}", email);

                // 사용자 이메일을 기반으로 가장 최신 인증 정보를 데이터베이스에서 조회
                Certification certificationEntity = certificationRepository.findTopByEmailOrderByCreatedDateDesc(email);

                // 인증 정보가 없을 경우 인증 실패 응답 반환
                if (certificationEntity == null) {
                    log.info("No certification information found for email: {}", email);
                    return CheckCertificationResponseDto.certificationFail();  // 인증 정보가 없으면 실패 응답 반환
                }

                log.info("Certification information retrieved for email: {}", email);

                // 저장된 이메일과 인증 번호가 입력된 이메일과 인증 번호와 일치하는지 검증
                boolean isSuccessed = certificationEntity.getEmail().equals(email) &&
                    certificationEntity.getCertificationNumber().equals(inputCertificationNumber);

                // 인증 실패 시 응답 반환
                if (!isSuccessed) {
                    log.info("Certification failed for email: {}", email);
                    return CheckCertificationResponseDto.certificationFail();  // 인증 정보가 일치하지 않으면 실패 응답 반환
                }

            } catch (Exception e) {
                // 예외 발생 시 예외 스택 트레이스 출력 및 데이터베이스 오류 응답 반환
                log.info("An error occurred while checking certification for email: {}", dto.getEmail(), e);
                return ResponseDto.databaseError();  // 예외 발생 시 데이터베이스 오류 응답 반환
            }

            // 인증 성공 시 성공 응답 반환
            log.info("Certification successful for email: {}", dto.getEmail());
            return CheckCertificationResponseDto.success();  // 인증이 성공하면 성공 응답 반환
        }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        log.info("Received sign-up request for email: {}", dto.getEmail());
        try {
            String userEmail = dto.getEmail();
            boolean isExistEmail = userRepository.existsByEmail(userEmail);
            if (isExistEmail) {
                log.info("Email already exists: {}", userEmail);
                return SignUpResponseDto.duplicateId();
            }

            String email = dto.getEmail();
            Certification certificationEntity = certificationRepository.findTopByEmailOrderByCreatedDateDesc(userEmail);

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

        /**
         * 1.email 뽑아오기
         * 2.비밀번호 == encoding된 비밀번호
         * 3. 매치되면 jwtToken 생성
         * 4. 토큰담아서 response
         * @param dto
         * @return
         */
        /**
         * 로그인 메서드
         *
         * @param dto : 로그인 요청 정보가 담긴 DTO
         * @return 로그인 결과가 담긴 응답 DTO
         */
        @Override
        public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
            try {
                String userEmail = dto.getEmail();
                User user = userRepository.findUserByEmail(userEmail);
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
        }
}
