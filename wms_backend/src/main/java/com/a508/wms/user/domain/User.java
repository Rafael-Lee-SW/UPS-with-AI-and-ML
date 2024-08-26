    package com.a508.wms.user.domain;

    import com.a508.wms.business.domain.Business;
    import com.a508.wms.user.dto.UserRequestDto;
    import com.a508.wms.util.BaseTimeEntity;
    import com.a508.wms.util.constant.LoginTypeEnum;
    import com.a508.wms.util.constant.RoleTypeEnum;
    import com.a508.wms.util.constant.StatusEnum;
    import jakarta.persistence.Column;
    import jakarta.persistence.Entity;
    import jakarta.persistence.EnumType;
    import jakarta.persistence.Enumerated;
    import jakarta.persistence.FetchType;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;
    import jakarta.persistence.OneToOne;
    import jakarta.persistence.Table;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.NoArgsConstructor;

    import java.time.LocalDate;
    import org.hibernate.annotations.SQLRestriction;

    @Entity
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @SQLRestriction("status_enum = 'Active'")
    @Builder
    @Table(name = "user")
    public class User extends BaseTimeEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 100 ,unique = true)
        private String email;

        @Column( length = 255)
        private String password;

        @Column(length = 20)
        private String name;

        @Column(length = 50)
        private String nickname;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, columnDefinition = "ENUM('GENERAL', 'EMPLOYEE', 'BUSINESS') DEFAULT 'GENERAL'")
        private RoleTypeEnum roleTypeEnum;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, columnDefinition = "ENUM('GENERAL', 'KAKAO', 'NAVER') DEFAULT 'GENERAL'")
        private LoginTypeEnum loginTypeEnum;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, columnDefinition = "ENUM('ACTIVE', 'DELETED', 'INACTIVE')")
        private StatusEnum statusEnum;

        @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
        private Business business;

        @Column(nullable = true)
        private Long businessId;

        @Column
        private LocalDate businessAddDate;

        // 연관 관계 편의 메서드
        public void setBusiness(Business business) {
            this.business = business;
            if (business != null) {
                business.setUser(this);
            }
        }

        public void updatePassword(String password) {
            this.password = password;
        }

        public void updateInfo(UserRequestDto userRequestDto) {
            this.name = userRequestDto.getName();
            this.nickname = userRequestDto.getNickname();
        }

        public void updateRoleTypeEnum(RoleTypeEnum roleTypeEnum) {
            this.roleTypeEnum = roleTypeEnum;
        }

        public void setStatusEnum(StatusEnum statusEnum) {
            this.statusEnum = statusEnum;
        }

        public void updateBusinessId(Long businessId) {
            this.businessId = businessId;
        }

        public void updateBusinessAddDate(LocalDate businessAddDate) {
            this.businessAddDate = businessAddDate;
        }
    }
