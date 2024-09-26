package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.EmailCertificationRequest;
import com.a302.wms.domain.auth.dto.request.CheckCertificationRequest;
import com.a302.wms.domain.auth.dto.response.auth.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponse> idCheck(@Valid EmailCertificationRequest dto);
    ResponseEntity<? super EmailCertificationResponse> emailCertification(
            EmailCertificationRequest dto);
    ResponseEntity<? super CheckCertificationResponse> checkCertification(CheckCertificationRequest dto);
}