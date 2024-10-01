package com.a302.wms.domain.user.service;

import com.a302.wms.domain.user.dto.UserPasswordUpdateRequest;
import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.dto.UserUpdateRequest;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.util.PasswordUtil;
import com.a302.wms.global.constant.SocialLoginTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl {

    private final UserRepository userRepository;
    private final UserModuleService userModuleService;

    /**
     * 회원가입
     *
     * @param dto
     * @return
     */
    public UserResponse save(UserSignUpRequest dto) {
        SocialLoginTypeEnum socialLoginType = SocialLoginTypeEnum.GENERAL;
        String hashedPassword = PasswordUtil.hashPassword(dto.password()); //TODO 암호화 하기
        User user = UserMapper.fromUserSignUpRequest(dto, hashedPassword, socialLoginType);
        User createdUser = userRepository.save(user);
        return UserMapper.toUserResponse(createdUser);
    }

    /**
     * id로 회원 조회
     *
     * @param id
     * @return
     */
    public UserResponse findById(Long id) {
        log.info("[Service] find User by id");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id"));
        return UserMapper.toUserResponse(user);
    }

    /**
     * 회원 정보 수정
     *
     * @param id
     * @param request
     * @return
     */
    public UserResponse update(Long id, UserUpdateRequest request) {
        log.info("[Service] update User by id");
        User user = userRepository.findById(id).orElseThrow();
        user.updateInfo(request);
        User updatedUser = userRepository.save(user);

        return UserMapper.toUserResponse(updatedUser);
    }

    /**
     * 비밀번호 변경
     *
     * @param userId
     * @param userPasswordUpdateRequest
     */
    public void updatePassword(Long userId, UserPasswordUpdateRequest userPasswordUpdateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        String hashedCurrentPassword = PasswordUtil.hashPassword(userPasswordUpdateRequest.currentPassword());
        if (!user.getPassword().equals(hashedCurrentPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }
        String hashedNewPassword = PasswordUtil.hashPassword(userPasswordUpdateRequest.newPassword());

        user.setPassword(hashedNewPassword);
        userRepository.save(user);
        log.info("사용자의 비밀번호가 성공적으로 변경되었습니다.");
    }

    /**
     * 회원 탈퇴
     *
     * @param id
     * @return
     */
    public UserResponse delete(Long id) {
        log.info("[Service] delete User by id");
        User user = userModuleService.findById(id);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        userRepository.deleteById(id);

        return UserMapper.toUserResponse(user);
    }

}
