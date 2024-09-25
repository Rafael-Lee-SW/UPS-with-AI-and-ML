package com.a302.wms.domain.user.dto;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class UserRequestDto {

    private String name;
    private String userNumber;
}
