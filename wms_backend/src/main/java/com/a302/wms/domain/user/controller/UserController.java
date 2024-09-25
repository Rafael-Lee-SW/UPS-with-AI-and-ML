package com.a302.wms.domain.user.controller;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.service.UserService;
import com.a302.wms.global.response.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "사용자 관리", description = "사용자의 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 특정 id를 가진 사용자의 정보를 조회하는 메서드
     *
     * @param id : 사용자 고유 번호
     * @return UserDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<?> findById(@PathVariable Long id) {
        log.info("[Controller] find User by productId: {}", id);
        return new BaseSuccessResponse<>(userService.findById(id));
    }

    /**
     * 사용자 정보 수정
     *
     * @param userId      : 사용자 고유 번호
     * @param userRequestDto : 사용자 정보가 담긴 Dto
     * @return UserDto
     */
    @PutMapping("/{userId}")
    public BaseSuccessResponse<?> update(@PathVariable Long userId,
        @RequestBody UserRequestDto userRequestDto) {
        log.info("[Controller] update User by productId");
        return new BaseSuccessResponse<>(userService.update(userId, userRequestDto));
    }

    /**
     * 사용자의 정보를 삭제하는 메서드
     *
     * @param userId : 사용자 고유 번호
     */
    @DeleteMapping("/{userId}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long userId) {
        log.info("[Controller] delete User by productId");
        userService.delete(userId);
        return new BaseSuccessResponse<>(null);
    }

}
