package com.a302.wms.domain.auth.controller;


import com.a302.wms.domain.auth.dto.request.CheckCertificationRequest;
import com.a302.wms.domain.auth.dto.request.DeviceOtpCreateRequest;
import com.a302.wms.domain.auth.dto.request.EmailCertificationRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.auth.CheckCertificationResponse;
import com.a302.wms.domain.auth.dto.response.auth.EmailCertificationResponse;
import com.a302.wms.domain.auth.dto.response.auth.IdCheckResponse;
import com.a302.wms.domain.auth.dto.response.auth.SignInResponse;
import com.a302.wms.domain.auth.service.AuthServiceImpl;
import com.a302.wms.domain.auth.service.OtpServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auths")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthServiceImpl authService;
    private final OtpServiceImpl otpService;

    /**
     * deviceId로 해당 device에 해당하는 otp 키 생성하여 반환
     * @param deviceId
     * @return
     */
    @GetMapping("/device-otps/{deviceId}")
    public ResponseEntity<String> createDeviceOtp(
//            @RequestBody DeviceOtpCreateRequest deviceOtpCreateRequest
            @PathVariable Long deviceId
    ) {
        DeviceOtpCreateRequest deviceOtpCreateRequest = new DeviceOtpCreateRequest(deviceId);
        log.info("[Controller] get device otp for store {}", deviceOtpCreateRequest.deviceId());
        return otpService.createDeviceOtp(deviceOtpCreateRequest);
    }

    /**
     * otp string을 받아 device ID를 return
     * @param otpString
     * @return
     */
    @GetMapping("/devices/sign-in/{otpString}")
    public ResponseEntity<Long> deviceSignIn(
        @PathVariable String otpString
    ) {
        return authService.deviceSignIn(otpString);
    }
//
//    @DeleteMapping("/devices/sign-out")
//    public ResponseEntity<Boolean> deviceSignOut(){
//
//    }
//
//
//    @PostMapping("/sign-in")
//    public ResponseEntity<SignInResponse> deviceSignIn(
//            @RequestBody @Valid SignInRequest signInRequest
//    ) {
//        return authService;
//    }
//
//    @DeleteMapping("/sign-out")
//    public ResponseEntity<Void> deviceSignOut() {
//        return;
//    }
}
