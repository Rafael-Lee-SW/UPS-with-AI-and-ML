package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a302.wms.domain.auth.dto.response.auth.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck(@Valid EmailCertificationRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
            EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
}