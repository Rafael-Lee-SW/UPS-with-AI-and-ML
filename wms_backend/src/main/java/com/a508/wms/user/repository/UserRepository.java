package com.a508.wms.user.repository;

import com.a508.wms.user.domain.User;
import com.a508.wms.util.constant.RoleTypeEnum;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    //businessId에 맞는 role이 직원인 모든 직원을 반환
    @Query("SELECT u FROM User u WHERE u.businessId = :businessId AND u.roleTypeEnum = :roleTypeEnum")
    List<User> findEmployeesByBusinessId(@Param("businessId") Long businessId,
        @Param("roleTypeEnum") RoleTypeEnum roleTypeEnum);

    // role이 직원인 모든 사용자를 반환
    @Query("SELECT u FROM User u WHERE u.roleTypeEnum = :roleTypeEnum")
    List<User> findAllEmployees(@Param("roleTypeEnum") RoleTypeEnum roleTypeEnum);

    // businessId에 맞는 모든 사용자를 반환
    @Query("SELECT u FROM User u WHERE u.businessId = :businessId")
    List<User> findAllByBusinessId(@Param("businessId") Long businessId);

    User findUserByEmail(String email);

    Optional<User> findByEmail(String email);
}