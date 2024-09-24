package com.a302.wms.domain.user.service;

import com.a302.wms.domain.user.dto.UserPasswordUpdateRequest;
import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.dto.UserSignUpRequest;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl {

    private final UserRepository userRepository;
    private final UserModuleService userModuleService;

    public UserResponseDto save(UserSignUpRequest dto) {
        String hashedPassword = PasswordUtil.hashPassword(dto.password()); //TODO 암호화 하기
        User user = UserMapper.toEntity(dto, hashedPassword);
        User createdUser = userRepository.save(user);
        return UserMapper.toUserResponseDto(createdUser);
    }

    public UserResponseDto findById(Long id) {
        log.info("[Service] find User by id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
        return UserMapper.toUserResponseDto(user);
    }

    // 정보수정
    public UserResponseDto update(Long id, UserRequestDto request) {
        log.info("[Service] update User by id: {}", id);
        User user = userModuleService.findById(id);
        user.updateInfo(request);
        User updatedUser = userModuleService.save(user);

        return UserMapper.toUserResponseDto(updatedUser);
    }

    // 비밀번호 변경
    public void updatePassword(Long userId, UserPasswordUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        String hashedCurrentPassword = PasswordUtil.hashPassword(request.currentPassword());
        if (!user.getPassword().equals(hashedCurrentPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }
        String hashedNewPassword = PasswordUtil.hashPassword(request.newPassword());

        user.setPassword(hashedNewPassword);
        userRepository.save(user);
        log.info("사용자의 비밀번호가 성공적으로 변경되었습니다.");
    }

    // 탈퇴
    public UserResponseDto delete(Long id) {
        log.info("[Service] delete User by id: {}", id);
        User user = userModuleService.findById(id);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 직원입니다.");
        }
        userRepository.deleteById(id);

        return UserMapper.toUserResponseDto(user);
    }

}
