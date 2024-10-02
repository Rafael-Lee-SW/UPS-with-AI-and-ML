package com.a302.wms.domain.user.controller;

import com.a302.wms.domain.user.dto.UserPasswordUpdateRequest;
import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.dto.UserUpdateRequest;
import com.a302.wms.domain.user.service.UserServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "유저 관리", description = "유저 관리")
// TODO : 나중에 userId 제거(토큰에서 추출)
public class UserController {

    private final UserServiceImpl userService;

    /**
     * 회원가입
     *
     * @param userSignUpRequest
     * @return
     */
    @PostMapping("/sign-up")
    public BaseSuccessResponse<UserResponse> save(
            @RequestBody UserSignUpRequest userSignUpRequest) {
        UserResponse response = userService.save(userSignUpRequest);
        return new BaseSuccessResponse<>(response);
    }

    /**
     * Id로 사용자 조회
     *
     * @param userId
     * @return
     */
    @GetMapping("/{userId}")
    public BaseSuccessResponse<UserResponse> findById(@PathVariable Long userId) {
        if (userId != null) {
            log.info("[Controller] find User by userId");
            return new BaseSuccessResponse<>(userService.findById(userId));
        }
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 특정 유저 수정
     *
     * @param userId
     * @param userUpdateRequest
     * @return
     */
    @PatchMapping("/{userId}")
    public BaseSuccessResponse<UserResponse> update(
            @PathVariable("userId") Long userId, @RequestBody UserUpdateRequest userUpdateRequest) {
        log.info("[Controller] update user by userId");
        return new BaseSuccessResponse<>(userService.update(userId, userUpdateRequest));
    }

    /**
     * 비밀번호 변경
     *
     * @param userId
     * @param userPasswordUpdateRequest
     * @return
     */
    @PatchMapping("/{userId}/password-change")
    public BaseSuccessResponse<UserResponse> updatePassword(
            @PathVariable("userId") Long userId,
            @RequestBody UserPasswordUpdateRequest userPasswordUpdateRequest) {
        userService.updatePassword(userId, userPasswordUpdateRequest);
        log.info("[Controller] change password by userId");
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 회원 탈퇴
     *
     * @param userId
     */
    @DeleteMapping("/{userId}")
    public BaseSuccessResponse<Void> delete(@PathVariable("userId") Long userId) {
        log.info("[Controller] delete user by userId");
        userService.delete(userId);
        return new BaseSuccessResponse<>(null);
    }


    /**
     * 이메일 중복 체크 메서드
     *
     * @param email
     * @return
     */
    @GetMapping("/check-email")
    public BaseSuccessResponse<Void> checkEmail(
            @RequestParam(value = "email") String email
    ) {
        log.info("[Controller] check email");
        userService.emailDuplicateCheck(email);
        return new BaseSuccessResponse<>(null);
    }
}
