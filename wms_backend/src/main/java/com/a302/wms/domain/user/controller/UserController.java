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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/sign-up")
    public BaseSuccessResponse<UserResponseDto> save(@RequestBody UserSignUpRequest request) {
        UserResponseDto response = userService.save(request);
        return new BaseSuccessResponse<>(response);
    }

    // 특정 유저 조회
    @GetMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> findById(@PathVariable Long id) {
        if (id != null) {
            log.info("[Controller] find User by id: {}", id);
            return new BaseSuccessResponse<>(userService.findById(id));
        }  return new BaseSuccessResponse<>(null);
    }

    // 특정 유저 수정
    @PutMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> update(@PathVariable("id") Long id,
                                                       @RequestBody UserRequestDto request) {
        log.info("[Controller] update user by id: {}", id);
        return new BaseSuccessResponse<>(userService.update(id, request));
    }

    @PutMapping("/{id}/password-change")
    public BaseSuccessResponse<UserResponseDto> updatePassword(@PathVariable("id") Long id,
                                                               @RequestBody UserPasswordUpdateRequest request) {
        userService.updatePassword(id, request);
        log.info("[Controller] change password by id: {}", id);
        return new BaseSuccessResponse<>(null);
    }

    @DeleteMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> delete(@PathVariable("id") Long id) {
        log.info("[Controller] delete user by id: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }

}