package com.a302.wms.user.service;

import com.a302.wms.user.entity.User;
import com.a302.wms.user.dto.UserRequestDto;
import com.a302.wms.user.dto.UserResponseDto;
import com.a302.wms.util.constant.RoleTypeEnum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.a302.wms.user.mapper.UserMapper.toUserResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserModuleService userModuleService;

    /**
     * 사업체 생성 메서드
     *
     * @param request
     * @return
     */
    @Transactional
    public UserResponseDto create(Long userId, UserRequestDto request) {
        log.info("[Service] create User by userId: {}", userId);
        User.UserBuilder builder = User.builder();

        User user = userModuleService.findById(userId);
        user.updateRoleTypeEnum(RoleTypeEnum.BUSINESS); //User 등록하면서 유저 역할 변경
        builder.user(user);

        if (request.getName() != null) {
            builder.name(request.getName());
        }
        if (request.getUserNumber() != null) {
            builder.userNumber(request.getUserNumber());
        }
        User user = builder.build();
        try {
            User savedUser = userModuleService.save(user);
            user.updateUserId(savedUser.getId());
            // 비즈니스 ID 포함한 ResponseDto 반환
            return toUserResponseDto(savedUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 특정 id를 가진 사업체의 정보를 조회하여 반환하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return UserDto
     */
    public UserResponseDto findById(long id) {
        log.info("[Service] find User by productId: {}", id);
        try {
            User user = userModuleService.findById(id);
            return toUserResponseDto(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 수정하는 메서드 수정 가능한 부분은 사업체에 관한 개인 정보들(이름, 사업체번호)
     *
     * @param request : 사업체 정보가 담긴 Dto
     * @return UserDto
     */
    @Transactional
    public UserResponseDto update(Long id, UserRequestDto request) {
        log.info("[Service] update User by productId: {}", id);
        try {
            // 수정할 필드 값 변경하기
            User updatedUser = userModuleService.findById(id);
            updatedUser.updateName(request.getName());
            updatedUser.updateUserNumber(request.getUserNumber());
            updatedUser = userModuleService.save(updatedUser);
            // 변경 후 return
            return toUserResponseDto(updatedUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리 d delete시 유저의 Role과 함께 직원들의 관계도
     * 끊어줘야한다.
     *
     * @param id : 사업체 고유 번호
     * @return UserDto
     */
    @Transactional
    public UserResponseDto delete(Long id) {
        try {
            log.info("[Service] delete User by productId: {}", id);
            User existingUser = userModuleService.findById(id);
            User user = existingUser.getUser();
            User deletedUser = userModuleService.delete(existingUser);
            user.updateRoleTypeEnum(RoleTypeEnum.GENERAL);

            List<User> employees = userModuleService.findByUserId(deletedUser.getId());
            for (User employee : employees) {
                employee.updateUserId(-1L);
                employee.updateRoleTypeEnum(RoleTypeEnum.GENERAL);
            }
            user.updateUserId(-1L);
            return toUserResponseDto(deletedUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
