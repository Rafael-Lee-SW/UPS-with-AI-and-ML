package com.a302.wms.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public record IdCheckRequest(
        @Email(message = "이메일 형식이 잘못되었습니다.")
        @NotBlank(message = "이메일은 비워둘 수 없습니다.")
        String email,

        @NotBlank(message = "인증 번호는 비워둘 수 없습니다.")
        String certificationNumber

) {
}
