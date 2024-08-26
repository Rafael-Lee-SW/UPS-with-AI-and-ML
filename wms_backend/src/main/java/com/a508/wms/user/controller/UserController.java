package com.a508.wms.user.controller;

import com.a508.wms.user.dto.UserRequestDto;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.exception.UserException;
import com.a508.wms.user.service.UserModuleService;
import com.a508.wms.user.service.UserService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserModuleService userModuleService;

    @GetMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> findById(@PathVariable Long id) {
        if (id != null) {
            log.info("[Controller] find User by id: {}", id);
            return new BaseSuccessResponse<>(userService.findById(id));
        }  return new BaseSuccessResponse<>(null);
    }

    @GetMapping
    public BaseSuccessResponse<?> find(@RequestParam(required = false, name = "businessId") Long businessId,
                                       @RequestParam(required = false, name = "email") String email) {
        if (businessId != null) {
            log.info("[Controller] find User by businessId: {}", businessId);
            return new BaseSuccessResponse<>(userService.findAllByBusinessId(businessId));
        } else if (email != null) {
            log.info("[Controller] find User by email: {}", email);
            return new BaseSuccessResponse<>(userService.findByEmail(email));
        }
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id      : 직원의 고유 번호
     * @param request : 변경할 직원의 정보
     * @return UserDto : 변경된 직원의 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> update(@PathVariable("id") Long id,
        @RequestBody UserRequestDto request) {
        log.info("[Controller] update user by id: {}", id);
        return new BaseSuccessResponse<>(userService.update(id, request));
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return UserDto : 변경된 직원의 정보
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> delete(@PathVariable("id") Long id) {
        log.info("[Controller] delete user by id: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }
    /**
     * userId, businessId로 해당 user의 businessId를 수정
     * @param businessId
     * @param id
     * @return
     */
    @PutMapping
    public BaseSuccessResponse<Void> updateByBusinessIdAndId(@RequestParam("businessId") Long businessId,
                                                             @RequestParam("id") Long id) throws UserException {
        log.info("[Controller] update User by businessId: {}", businessId);
        userService.updateByBusinessIdAndId(businessId, id);
        return new BaseSuccessResponse<>(null);
    }
    @PatchMapping
    public BaseSuccessResponse<Void> deleteByBusinessIdAndId(@RequestParam("businessId") Long businessId,
                                                             @RequestParam("id") Long id) throws UserException{
        log.info("[Controller] delete User by businessId and id: {}", businessId);
        userService.deleteByBusinessIdAndId(businessId, id);
        return new BaseSuccessResponse<>(null);
    }
}
