package com.a302.wms.domain.auth.repository;

import com.a302.wms.domain.auth.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {

    // 최신 인증 정보를 가져오기 위해 생성일(createdDate)을 기준으로 정렬
    Certification findTopByEmailOrderByCreatedDateDesc(String email);

    Certification findByEmail(String email);

    @Transactional
    Certification deleteByEmail(String email);
}