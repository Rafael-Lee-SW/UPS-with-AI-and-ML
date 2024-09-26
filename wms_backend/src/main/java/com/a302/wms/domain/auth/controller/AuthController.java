package com.a302.wms.domain.auth.controller;


import com.a302.wms.domain.auth.dto.request.CheckCertificationRequest;
import com.a302.wms.domain.auth.dto.request.EmailCertificationRequest;
import com.a302.wms.domain.auth.dto.response.auth.CheckCertificationResponse;
import com.a302.wms.domain.auth.dto.response.auth.EmailCertificationResponse;
import com.a302.wms.domain.auth.dto.response.auth.IdCheckResponse;
import com.a302.wms.domain.auth.service.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/email-check")
    public ResponseEntity<? super IdCheckResponse> idCheck(
            @RequestBody @Valid EmailCertificationRequest requestBody
    ) {
        return authService.idCheck(requestBody);
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponse> emailCertification(
            @RequestBody @Valid EmailCertificationRequest requestBody
    ){
        ResponseEntity<? super EmailCertificationResponse> response =
                authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponse> checkCertification(
            @RequestBody @Valid CheckCertificationRequest requestBody
    ){
        ResponseEntity<? super CheckCertificationResponse> response =authService.checkCertification(requestBody);
        return response;
    }
}
