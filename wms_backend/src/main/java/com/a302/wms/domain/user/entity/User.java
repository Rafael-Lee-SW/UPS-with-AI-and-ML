package com.a302.wms.domain.user.entity;

import com.a302.wms.domain.user.dto.UserUpdateRequest;
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

    public void updateInfo(UserUpdateRequest userUpdateRequest) {
        this.userName = userUpdateRequest.userName();
        this.email = userUpdateRequest.email();
    }

    public void setPassword(String newPassword) {
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 항목입니다.");
        }
        this.password = newPassword;
    }

    @Builder

    public User(String email,
                Long id,
                String password,
                SocialLoginTypeEnum socialLoginType,
                String userName) {
        this.email = email;
        this.id = id;
        this.password = password;
        this.socialLoginType = socialLoginType;
        this.userName = userName;
    }
}
