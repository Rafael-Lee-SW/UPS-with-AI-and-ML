package com.a302.wms.domain.certification.provider;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(EmailProvider.class);
    private final JavaMailSender javaMailSender;

    private final String SUBJECT = "[Auto Store] 인증 메일입니다.";

    /**
     * 인증 이메일 전송
     * @param email 전송할 이메일
     * @param certificationNumber 인증번호
     * @return
     */
    public boolean sendCertificationMail(String email, String certificationNumber) {
        try {
            logger.info("이메일 전송 시도 중");
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
            String htmlContent = getCertificationMessage(certificationNumber);

            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent, true);
            javaMailSender.send(message);
            logger.info("메일 전송 성공");
            return true;  // 이메일 전송 성공 시 true 반환
        } catch (Exception e) {
            logger.error("메일 전송 실패", e);
            return false;  // 이메일 전송 실패 시 false 반환
        }
    }

    /**
     * 인증번호 메시지 html 템플릿
     * @param certificationNumber
     * @return
     */
    private String getCertificationMessage(String certificationNumber) {
        return "<h1 style='text-align: center;'>[Auto Store] 인증 메일입니다. </h1>" +
                "<h3 style='text-align: center;'>" +
                "인증 코드 : <strong style='font-size:32px; letter-spacing:8px;'>" +
                certificationNumber + "</strong></h3>";
    }
}
