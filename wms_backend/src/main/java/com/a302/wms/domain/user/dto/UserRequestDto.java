package com.a302.wms.domain.user.dto;

import lombok.*;

@Builder
public record UserRequestDto(
        String userName,
        String email
) {

}
