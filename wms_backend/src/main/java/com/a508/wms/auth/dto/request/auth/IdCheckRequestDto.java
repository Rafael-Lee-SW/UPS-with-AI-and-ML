package com.a508.wms.auth.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class IdCheckRequestDto {

    @Email(message = "이메일 형식이 잘못되었습니다.")
    @NotBlank(message = "이메일은 비워둘 수 없습니다.")
    private String email;

    @NotBlank(message = "인증 번호는 비워둘 수 없습니다.")
    private String certificationNumber;

}
