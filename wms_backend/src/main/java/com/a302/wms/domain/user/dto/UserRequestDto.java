package com.a302.wms.domain.user.dto;

import lombok.*;

@Builder
public record UserRequestDto(
        String username,
        String email
) {

}
