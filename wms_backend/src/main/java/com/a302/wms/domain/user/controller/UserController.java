package com.a302.wms.domain.user.controller;

import com.a302.wms.domain.user.dto.UserPasswordUpdateRequest;
import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
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
    public BaseSuccessResponse<UserResponseDto> save(@RequestBody UserSignUpRequest request) {
        UserResponseDto response = userService.save(request);
        return new BaseSuccessResponse<>(response);
    }

    /**
     * Id로 사용자 조회
     * @param id
     * @return
     */
    @GetMapping("/{userId}")
    public BaseSuccessResponse<UserResponseDto> findById(@PathVariable Long id) {
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
    public BaseSuccessResponse<UserResponseDto> update(@PathVariable("id") Long id,
                                                       @RequestBody UserRequestDto request) {
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
    public BaseSuccessResponse<UserResponseDto> updatePassword(@PathVariable("id") Long id,
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
    public BaseSuccessResponse<UserResponseDto> delete(@PathVariable("id") Long id) {
        log.info("[Controller] delete user by id: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }

}