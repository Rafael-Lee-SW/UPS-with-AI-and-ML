package com.a302.wms.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public record EmailCertificationRequest(
        @Email
        @NotBlank
        String email
) {


}
