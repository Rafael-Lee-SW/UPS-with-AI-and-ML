package com.a302.wms.domain.auth.controller;


import com.a302.wms.domain.auth.dto.request.DeviceSignInRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.DeviceSignInResponse;
import com.a302.wms.domain.auth.dto.response.UserSignInResponse;
import com.a302.wms.domain.auth.service.AuthServiceImpl;
import com.a302.wms.domain.auth.service.OtpServiceImpl;
import com.a302.wms.domain.user.dto.UserResponse;
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
    public BaseSuccessResponse<DeviceSignInResponse> deviceSignIn(
            @RequestBody DeviceSignInRequest deviceOtpSingInRequest
    ) {
        return new BaseSuccessResponse<>(authService.deviceSignIn(deviceOtpSingInRequest));
    }

    /**
     * 유저 로그인
     *
     * @param signInRequest
     * @return
     */
    @PostMapping("/sign-in")
    public BaseSuccessResponse<UserSignInResponse> signIn(
            @RequestBody @Valid SignInRequest signInRequest
    ) {
        return new BaseSuccessResponse<>(authService.signIn(signInRequest));
    }

    @GetMapping("/social-sign-in")
    public BaseSuccessResponse<UserResponse> getUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestParam(name = "email") String email
    ) {
        log.info("get user email {}", email);
        return new BaseSuccessResponse<>(authService.socialSignIn(email));
    }

    /**
     * 유저 및 디바이스 로그아웃
     *
     * @param header
     * @return
     */
    @DeleteMapping("/sign-out")
    public BaseSuccessResponse<Void> signOut(@RequestHeader("Authorization") String header) {
        authService.signOut(header);
        return new BaseSuccessResponse<>(null);
    }

}
