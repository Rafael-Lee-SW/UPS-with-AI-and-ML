package com.a302.wms.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

@Builder
public record UserSignUpRequest(
        @NotBlank(message = "이름을 입력해 주세요.")
        @Length(max = 255, message = "적절한 이름을 입력해 주세요 (최대 255자)")
        String userName,
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Length(max = 255, message = "적절한 이메일을 입력해 주세요 (최대 255자)")
        String email,
        @NotBlank(message = "비밀번호를 입력해 주세요.")
        @Length(max = 255, message = "적절한 비밀번호를 입력해 주세요 (최대 255자)")
        String password
) {

}