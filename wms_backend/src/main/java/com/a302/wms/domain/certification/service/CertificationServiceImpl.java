package com.a302.wms.domain.certification.service;

import com.a302.wms.domain.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a302.wms.domain.certification.dto.Certification;
import com.a302.wms.domain.certification.provider.EmailProvider;
import com.a302.wms.domain.certification.repository.CertificationRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CertificationServiceImpl {

    private CertificationRedisRepository certificationRedisRepository;
    private EmailProvider emailProvider;

    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        log.info("[Service] Certification Email Service for email {}", dto.getEmail());
        try {
            // 이메일 주소 가져오기
            String email = dto.getEmail();
            log.info("Processing email certification for email: {}", email);

            // 인증 번호 생성
            String certificationNumber = createCertificationNumber();
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
            certificationRedisRepository.save(certification);
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

    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
            CheckCertificationRequestDto dto) {
        try {
            // 사용자 ID, 이메일, 인증 번호를 DTO로부터 가져옴
            String email = dto.getEmail();  // 이메일을 DTO로부터 가져옴
            String inputCertificationNumber = dto.getCertificationNumber();  // 인증 번호를 DTO로부터 가져옴

            log.info("Received certification check request for email: {}", email);

            // 사용자 이메일을 기반으로 가장 최신 인증 정보를 데이터베이스에서 조회
            Certification certificationEntity = certificationRedisRepository.findByEmail(email).get();

            // 인증 정보가 없을 경우 인증 실패 응답 반환
            if (certificationEntity == null) {
                log.info("No certification information found for email: {}", email);
                return CheckCertificationResponseDto.certificationFail();  // 인증 정보가 없으면 실패 응답 반환
            }

            log.info("Certification information retrieved for email: {}", email);

            // 저장된 이메일과 인증 번호가 입력된 이메일과 인증 번호와 일치하는지 검증
            boolean isSuccessed = certificationEntity.email().equals(email) &&
                    certificationEntity.certificationNumber().equals(inputCertificationNumber);

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


    public String createCertificationNumber() {
        String certificationNumber = "";

        for(int count = 0 ; count < 4 ; count++)
            certificationNumber += (int)(Math.random()*10);

        return certificationNumber;
    }
}