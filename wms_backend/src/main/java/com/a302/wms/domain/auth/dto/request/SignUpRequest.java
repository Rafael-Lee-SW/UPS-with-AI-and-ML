package com.a302.wms.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public record SignUpRequest(
        @Email
        @NotBlank
        String email,

        @NotBlank
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-z0-9]{8,13}$")
        String password,

        @NotBlank
        String name,

        @NotBlank
        String nickname

        ) {}
