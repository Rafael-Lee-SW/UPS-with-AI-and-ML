package com.a302.wms.domain.auth.controller;

import com.a302.wms.domain.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a302.wms.domain.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a302.wms.domain.auth.dto.response.auth.IdCheckResponseDto;
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
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ) {
        return authService.idCheck(requestBody);
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<? super EmailCertificationResponseDto> response =
                authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
            @RequestBody @Valid CheckCertificationRequestDto requestBody
    ){
        ResponseEntity<? super CheckCertificationResponseDto> response =authService.checkCertification(requestBody);
        return response;
    }
}
