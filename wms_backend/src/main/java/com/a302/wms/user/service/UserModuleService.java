package com.a302.wms.user.service;

import com.a302.wms.user.entity.User;
import com.a302.wms.user.repository.UserRepository;
import com.a302.wms.util.constant.StatusEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserModuleService {

    private final UserRepository userRepository;

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param userId: 사업체 고유 번호
     * @return UserDto
     */
    public User findById(long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User findByUserId(Long userId) {
        return userRepository.findByUserId(userId);
    }

    /**
     * 모든 사업체의 정보를 조회하는 메서드
     *
     * @return List<UserDto>
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * 사업체의 정보를 저장하는 기능
     *
     * @param user : 저장할 메서드
     * @return
     */
    public User save(User user) {
        return userRepository.save(user);
    }


    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     */

    public User delete(User user) {
        user.setStatusEnum(StatusEnum.DELETED);
        user.setUser(null);
        return save(user);
    }
}
