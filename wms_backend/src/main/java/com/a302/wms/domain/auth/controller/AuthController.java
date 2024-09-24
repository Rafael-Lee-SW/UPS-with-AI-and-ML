package com.a302.wms.domain.auth.controller;

import com.a302.wms.domain.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.SignInRequestDto;
import com.a302.wms.domain.auth.dto.request.auth.SignUpRequestDto;
import com.a302.wms.domain.auth.dto.response.auth.*;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.auth.service.AuthServiceImpl;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthServiceImpl authService;
//    private final DefaultOAuth2UserService defaultOAuth2UserService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

/*
    */
/**
     * 중복 이메일 체크하는 메서드
     * @param requestBody
     * @return
     *//*


    @PostMapping("/email-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ) {
        return userService.idCheck(requestBody);
    }

    */
/**
     * email 발송하는 메서드
     * @return
     *//*

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<? super EmailCertificationResponseDto> response =
                authService.emailCertification(requestBody);
        return response;
    }

    */
/**
     * email 검증하는 메서드
     * @param requestBody
     * @return
     *//*

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
            @RequestBody @Valid CheckCertificationRequestDto requestBody
    ){
        ResponseEntity<? super CheckCertificationResponseDto> response =authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
            @RequestBody SignUpRequestDto requestBody
    ){
        ResponseEntity<? super SignUpResponseDto> response =authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody
    ) {
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @GetMapping("/social-sign-in")
    public ResponseEntity<UserResponseDto> getUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestParam (name = "email")String email
    ) {
        log.info("get user email {}",email);
        // 토큰과 이메일을 검증하여 사용자 정보 반환
        User user = userService.findByEmail(email);
        log.info("selected user {}", user.toString());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        UserResponseDto userResponseDto = UserMapper.toUserResponseDto(user);
        return ResponseEntity.ok(userResponseDto);
    }


    @GetMapping("/refresh/token")
    public ResponseEntity<UserResponseDto> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        // JWT 토큰에서 "Bearer " 부분을 제거하고 토큰 값만 추출
        String token = authHeader.substring(7);

        // 토큰을 검증하고 이메일을 추출
        String email = jwtProvider.validate(token);

        if (email == null) {
            // 토큰이 유효하지 않으면 401 Unauthorized 응답 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 추출한 이메일로 사용자 정보를 조회
        User user = userService.findByEmail(email);

        // UserResponseDto 객체 생성

        UserResponseDto userResponseDto = UserMapper.toResponseDto(user);

        return ResponseEntity.ok(userResponseDto);
    }
*/

}
