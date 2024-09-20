package com.a302.wms.user.dto;

import com.a302.wms.util.constant.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class UserResponseDto {

    private Long id;
    private Long userId;
    private String name;
    private String userNumber;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;
}
