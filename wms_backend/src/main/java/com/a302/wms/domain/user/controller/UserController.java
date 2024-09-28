package com.a302.wms.domain.user.controller;

import com.a302.wms.domain.user.dto.UserPasswordUpdateRequest;
import com.a302.wms.domain.user.dto.UserUpdateRequest;
import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
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
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
public class UserController {

    private final UserServiceImpl userService;

    /**
     * 회원가입
     * @param request
     * @return
     */
    @PostMapping("/sign-up")
    public BaseSuccessResponse<UserResponse> save(@RequestBody UserSignUpRequest request) {
        UserResponse response = userService.save(request);
        return new BaseSuccessResponse<>(response);
    }

    /**
     * Id로 사용자 조회
     * @param id
     * @return
     */
    @GetMapping("/{userId}")
    public BaseSuccessResponse<UserResponse> findById(@PathVariable Long id) {
        if (id != null) {
            log.info("[Controller] find User by id: {}", id);
            return new BaseSuccessResponse<>(userService.findById(id));
        }  return new BaseSuccessResponse<>(null);
    }

    /**
     * 특정 유저 수정
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{userId}")
    public BaseSuccessResponse<UserResponse> update(@PathVariable("id") Long id,
                                                    @RequestBody UserUpdateRequest request) {
        log.info("[Controller] update user by id: {}", id);
        return new BaseSuccessResponse<>(userService.update(id, request));
    }

    /**
     * 비밀번호 변경
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{userId}/password-change")
    public BaseSuccessResponse<UserResponse> updatePassword(@PathVariable("id") Long id,
                                                            @RequestBody UserPasswordUpdateRequest request) {
        userService.updatePassword(id, request);
        log.info("[Controller] change password by id: {}", id);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 회원 탈퇴
     * @param id
     * @return
     */
    @DeleteMapping("/{userId}")
    public BaseSuccessResponse<UserResponse> delete(@PathVariable("id") Long id) {
        log.info("[Controller] delete user by id: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }

}