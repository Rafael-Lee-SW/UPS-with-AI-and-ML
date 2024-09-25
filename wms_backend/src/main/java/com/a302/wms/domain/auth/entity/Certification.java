package com.a302.wms.domain.auth.entity;

import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="certification")
@Table(name="certification")
public class Certification extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "certification_number", nullable = false) // 남겨진 컬럼 이름
    private String certificationNumber;

    public Certification(String email, String certificationNumber) {
        this.email = email;
        this.certificationNumber = certificationNumber;
    }
}
