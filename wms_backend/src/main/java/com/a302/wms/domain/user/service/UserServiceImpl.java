package com.a302.wms.domain.user.service;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.a302.wms.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

        User user = userRepository.findById(userId).get();
        builder.user(user);

        if (request.getName() != null) {
            builder.name(request.getName());
        }
        if (request.getUserNumber() != null) {
            builder.userNumber(request.getUserNumber());
        }
        user = builder.build();
        try {
            User savedUser = userRepository.save(user);
            // 비즈니스 ID 포함한 ResponseDto 반환
            return UserMapper.toUserResponseDto(savedUser);
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
            User user = userRepository.findById(id).get();
            return UserMapper.toUserResponseDto(user);
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
            User updatedUser = userRepository.findById(id).get();
            updatedUser.updateName(request.getName());
            updatedUser.updateUserNumber(request.getUserNumber());
            updatedUser = userRepository.save(updatedUser);
            // 변경 후 return
            return UserMapper.toUserResponseDto(updatedUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리 d delete시 유저의 Role과 함께 직원들의 관계도
     * 끊어줘야한다.
     * TODO
     * @param id : 사업체 고유 번호
     * @return UserDto
     */
    @Transactional
    public void delete(Long id) {
        try {
            log.info("[Service] delete User by productId: {}", id);
            User existingUser = userRepository.findById(id).get();
            userRepository.delete(existingUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
