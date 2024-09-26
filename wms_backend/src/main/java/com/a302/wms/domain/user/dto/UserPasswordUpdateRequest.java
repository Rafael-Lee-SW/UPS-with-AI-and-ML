package com.a302.wms.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Builder
public record UserPasswordUpdateRequest(
        @NotBlank(message = "기존 비밀번호를 입력해주세요.")
        @Length(max = 15, message = "적절한 비밀번호를 입력해 주세요 (최대 15자)")
        String currentPassword,
        @NotBlank(message = "새로운 비밀번호를 입력해주세요.")
        @Length(max = 15, message = "적절한 비밀번호를 입력해 주세요 (최대 15자)")
        String newPassword
) {

}
