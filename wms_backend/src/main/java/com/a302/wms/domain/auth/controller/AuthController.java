package com.a302.wms.domain.auth.controller;


import com.a302.wms.domain.auth.dto.request.DeviceSignInRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.AccessTokenResponse;
import com.a302.wms.domain.auth.service.AuthServiceImpl;
import com.a302.wms.domain.auth.service.OtpServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
     *
     * @param deviceId
     * @return
     */
    @GetMapping("/device-otps/{deviceId}")
    public BaseSuccessResponse<String> createDeviceOtp(
            @PathVariable Long deviceId
    ) {
        log.info("[Controller] get device otp for store {}", deviceId);
        return new BaseSuccessResponse<>(otpService.createDeviceOtp(deviceId));
    }

    /**
     * otp string을 받아 device ID를 return
     *
     * @param deviceOtpSingInRequest
     * @return
     */
    @GetMapping("/devices/sign-in")
    public BaseSuccessResponse<String> deviceSignIn(
            @RequestBody DeviceSignInRequest deviceOtpSingInRequest
    ) {
        return new BaseSuccessResponse<>(authService.deviceSignIn(deviceOtpSingInRequest));
    }

    //
//    @DeleteMapping("/devices/sign-out")
//    public ResponseEntity<Boolean> deviceSignOut(){
//
//    }
//
//
    @PostMapping("/sign-in")
    public BaseSuccessResponse<AccessTokenResponse> signIn(
            @RequestBody @Valid SignInRequest signInRequest
    ) {
        return new BaseSuccessResponse<>(authService.signIn(signInRequest));
    }

//    @DeleteMapping("/sign-out")
//    public BaseSuccessResponse<Void> deviceSignOut() {
//        authService.signOut()
//        return new BaseSuccessResponse<>(null);
//    }
}
