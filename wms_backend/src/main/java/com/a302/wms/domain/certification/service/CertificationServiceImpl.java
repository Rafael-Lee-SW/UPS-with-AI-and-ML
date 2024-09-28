package com.a302.wms.domain.certification.service;

import com.a302.wms.domain.auth.dto.request.CheckCertificationRequest;
import com.a302.wms.domain.auth.dto.request.EmailCertificationRequest;
import com.a302.wms.domain.certification.common.CertificationNumber;
import com.a302.wms.domain.certification.dto.Certification;
import com.a302.wms.domain.certification.provider.EmailProvider;
import com.a302.wms.domain.certification.repository.CertificationRepository;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.handler.CommonException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.a302.wms.global.constant.ResponseEnum.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class CertificationServiceImpl {

    private CertificationRepository certificationRepository;
    private final EmailProvider emailProvider;


    /**
     * checkCertification 메서드는 사용자가 입력한 인증 정보(사용자 ID, 이메일, 인증 번호)를 기반으로
     * 데이터베이스에 저장된 인증 정보와 비교하여 인증을 검증
     *
     * @param dto
     * @return
     */
    public void checkCertification(
            CheckCertificationRequest dto) {
        try {
            // 사용자 ID, 이메일, 인증 번호를 DTO로부터 가져옴
            String email = dto.email();  // 이메일을 DTO로부터 가져옴
            String inputCertificationNumber = dto.certificationNumber();  // 인증 번호를 DTO로부터 가져옴

            log.info("Received certification check request for email");

            // 사용자 이메일을 기반으로 가장 최신 인증 정보를 데이터베이스에서 조회
            Certification certificationEntity = certificationRepository.findByEmail(email).get();

            // 인증 정보가 없을 경우 인증 실패 응답 반환
            if (certificationEntity == null) {
                log.info("No certification information found for email");
                throw new CommonException(CERTIFICATION_FAILED, "인증정보가 없습니다.");
            }

            log.info("Certification information retrieved for email");

            // 저장된 이메일과 인증 번호가 입력된 이메일과 인증 번호와 일치하는지 검증
            boolean isSuccessed = certificationEntity.email().equals(email) &&
                    certificationEntity.certificationNumber().equals(inputCertificationNumber);

            // 인증 실패 시 응답 반환
            if (!isSuccessed) {
                log.info("Certification failed for email");
                throw new CommonException(CERTIFICATION_FAILED, "인증정보가 일치하지 않습니다.");
            }

        } catch (Exception e) {
            // 예외 발생 시 예외 스택 트레이스 출력 및 데이터베이스 오류 응답 반환
            log.info("An error occurred while checking certification for email", e);
            throw new CommonException(DATABASE_ERROR, e.getMessage());
        }

        // 인증 성공 시 성공 응답 반환
        log.info("Certification successful for email");
    }

    /**
     * 인증번호 생성 로직
     *
     * @return
     */
    public String createCertificationNumber() {
        String certificationNumber = "";

        for (int count = 0; count < 4; count++)
            certificationNumber += (int) (Math.random() * 10);

        return certificationNumber;
    }

    public void emailCertification(EmailCertificationRequest emailCertificationRequest) {
        log.info("emailCertification method called with dto: {}", emailCertificationRequest);
        try {
            // 이메일 주소 가져오기
            String email = emailCertificationRequest.email();

            // 인증 번호 생성
            String certificationNumber = CertificationNumber.getCertificationNumber();

            if (certificationNumber == null || certificationNumber.isEmpty()) {
                log.error("Certification number generation failed");
                throw new CommonException(ResponseEnum.MAIL_SEND_FAILED, "인증번호 생성에 실패하였습니다.");
            }

            // 인증 이메일 발송
            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);

            if (!isSuccessed) {
                log.error("Failed to send certification email to: {}", email);
                throw new CommonException(ResponseEnum.MAIL_SEND_FAILED, "메일 발송에 실패하였습니다.");
            }

            // 인증 정보를 저장
            Certification certification = new Certification(email, certificationNumber);
            certificationRepository.save(certification);
            log.info("Saved certification info for email: {}", email);

        } catch (NumberFormatException e) {
            // 이메일이 유효하지 않은 경우 예외 처리
            log.error("Invalid email format: {}", emailCertificationRequest.email(), e);
            throw new CommonException(INVALID_EMAIL, e.getMessage());
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email certification process", e);
            throw new CommonException(DATABASE_ERROR, e.getMessage());
        }
        // 이메일 인증 성공 응답 반환
        log.info("Email certification succeeded for email: {}", emailCertificationRequest.email());
    }
}