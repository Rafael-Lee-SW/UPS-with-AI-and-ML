package com.a302.wms.user.repository;

import com.a302.wms.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    public User findByUserId(Long userId);
}
