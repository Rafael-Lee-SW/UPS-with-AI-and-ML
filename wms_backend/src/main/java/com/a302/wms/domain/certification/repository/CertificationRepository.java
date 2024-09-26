package com.a302.wms.domain.certification.repository;

import com.a302.wms.domain.certification.dto.Certification;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificationRepository {

    void save(final Certification certification);

    void delete(final String certificationNumber);

    Optional<String> findByCertificationNumber(final String certificationNumber);

    Optional<Certification> findByEmail(final String email);

    default String getByCertificationNumber(final String certificationNumber) {
        return findByCertificationNumber(certificationNumber)
                .orElseThrow(() -> new RuntimeException("Certification number not found"));
    }
}
