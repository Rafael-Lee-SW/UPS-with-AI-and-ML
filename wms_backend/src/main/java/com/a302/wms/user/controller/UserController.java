package com.a302.wms.user.controller,

import com.a302.wms.user.dto.UserRequestDto,
import com.a302.wms.user.dto.UserResponseDto,
import com.a302.wms.user.service.UserService,
import com.a302.wms.util.BaseSuccessResponse,
import io.swagger.v3.oas.annotations.tags.Tag,
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/useres")
@Tag(name = "사업체 관리", description = "사업체의 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return UserDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<?> findById(@PathVariable Long id) {
        log.info("[Controller] find User by productId: {}", id);
        return new BaseSuccessResponse<>(userService.findById(id));
    }

    /**
     * 사업체 생성 메서드
     *
     * @param userId
     * @param request
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<?> create(@RequestParam(name = "userId") Long userId,
        @RequestBody UserRequestDto request) {
        log.info("[Controller] create User by userId: {}", userId);
        UserResponseDto responseDto = userService.create(userId, request);
        return new BaseSuccessResponse<>(responseDto);
    }

    /**
     * 사업체의 정보를 수정하는 메서드 현재 수정 가능한 부분은 사업체에 관한 개인 정보들(사업체 번호, 이름,이메일 등..)
     *
     * @param id      : 사업체 고유 번호
     * @param request : 사업체 정보가 담긴 Dto
     * @return UserDto
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?> update(@PathVariable Long id,
        @RequestBody UserRequestDto request) {
        log.info("[Controller] update User by productId: {}", id);
        return new BaseSuccessResponse<>(userService.update(id, request));
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     *
     * @param id : 사업체 고유 번호
     * @return UserDto
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<?> delete(@PathVariable Long id) {
        log.info("[Controller] delete User by productId: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }

}
