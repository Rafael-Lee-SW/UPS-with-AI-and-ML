package com.a302.wms.domain.user.dto;

import lombok.*;

@Builder
public record UserUpdateRequest(
        String userName,
        String email
) {

}
