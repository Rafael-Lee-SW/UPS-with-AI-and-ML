package com.a302.wms.domain.user.entity;

import com.a302.wms.domain.user.dto.UserRequestDto;
import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.global.constant.SocialLoginTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "user_name", nullable = false, length = 100, unique = true)
    private String userName;

    @Column(nullable = false, length = 100 ,unique = true)
    private String email;

    @Column(length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "social_login_type", nullable = false, columnDefinition = "ENUM('GENERAL', 'KAKAO', 'NAVER') DEFAULT 'GENERAL'")
    private SocialLoginTypeEnum socialLoginType;

    @Builder
    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    public void updateInfo(UserRequestDto userRequestDto) {
        this.userName = userRequestDto.userName();
        this.email = userRequestDto.email();
    }

    public void setPassword(String newPassword) {
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 항목입니다.");
        }
        this.password = newPassword;
    }

}
