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
public class UserServiceImpl {

  private final UserRepository userRepository;

  /**
   * 사용자 생성 메서드
   *
   * @param userRequestDto : 생성할 유저의 정보가 담긴 dto
   * @return 생성된 유저의 정보
   */
  @Transactional
  public UserResponseDto create(Long userId, UserRequestDto userRequestDto) {
    log.info("[Service] create User by userId");
    User.UserBuilder builder = User.builder();

    User user = userRepository.findById(userId).get();
    builder.user(user);

    if (userRequestDto.getName() != null) {
      builder.name(userRequestDto.getName());
    }
    if (userRequestDto.getUserNumber() != null) {
      builder.userNumber(userRequestDto.getUserNumber());
    }
    user = builder.build();
    try {
      User savedUser = userRepository.save(user);

      return UserMapper.toUserResponseDto(savedUser);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 특정 id를 가진 사용자의 정보를 조회하여 반환하는 메서드
   *
   * @param id : 사용자 고유 번호
   * @return UserDto
   */
  public UserResponseDto findById(long id) {
    log.info("[Service] find User by productId");
    try {
      User user = userRepository.findById(id).get();
      return UserMapper.toUserResponseDto(user);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 사용자의 정보를 수정하는 메서드
   *
   * @param request : 사용자 정보가 담긴 Dto
   * @return UserDto
   */
  @Transactional
  public UserResponseDto update(Long id, UserRequestDto request) {
    log.info("[Service] update User by productId");
    try {

      User updatedUser = userRepository.findById(id).get();
      updatedUser.updateName(request.getName());
      updatedUser.updateUserNumber(request.getUserNumber());
      updatedUser = userRepository.save(updatedUser);

      return UserMapper.toUserResponseDto(updatedUser);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 사용자의 정보를 삭제하는 메서드
   *
   * @param id : 사용자 고유 번호
   */
  @Transactional
  public void delete(Long id) {
    try {
      log.info("[Service] delete User by productId");
      User existingUser = userRepository.findById(id).get();
      userRepository.delete(existingUser);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
