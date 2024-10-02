package com.a302.wms.domain.certification.controller;

import com.a302.wms.domain.auth.dto.request.CheckCertificationRequest;
import com.a302.wms.domain.auth.dto.request.EmailCertificationRequest;
import com.a302.wms.domain.certification.service.CertificationServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/certifications")
@RequiredArgsConstructor
@Slf4j
public class CertificationController {


    private final CertificationServiceImpl certificationService;

    @PostMapping("/email-certification")
    public BaseSuccessResponse<Void> emailCertification(
            @RequestBody @Valid EmailCertificationRequest requestBody
    ) {
        log.info("[Controller] email certification");
        certificationService.emailCertification(requestBody);
        return new BaseSuccessResponse<>(null);
    }

    @PostMapping("/check-certification")
    public BaseSuccessResponse<Void> checkCertification(
            @RequestBody @Valid CheckCertificationRequest requestBody
    ) {
        certificationService.checkCertification(requestBody);
        return new BaseSuccessResponse<>(null);
    }
}
