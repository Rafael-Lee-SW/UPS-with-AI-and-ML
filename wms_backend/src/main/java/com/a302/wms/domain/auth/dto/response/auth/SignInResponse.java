package com.a302.wms.domain.auth.dto.response.auth;

import com.a302.wms.domain.auth.dto.ResponseCode;
import com.a302.wms.domain.auth.dto.ResponseMessage;
import com.a302.wms.domain.auth.dto.response.ResponseDto;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.dto.UserResponseDto;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignInResponse extends ResponseDto {
    private String token;
    private int expirationTime;
    private UserResponseDto user;

    private SignInResponse(String token, User user) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.token = token;
        this.expirationTime = 1800; // 30분
        this.user = UserMapper.toUserResponseDto(user); // Convert User to UserResponseDto
    }

    public static ResponseEntity<SignInResponse> success(String token, User user) {
        SignInResponse responseDto = new SignInResponse(token, user);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

    // JSON 변환 메서드 추가
    public String toJsonString() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}"; // 예외 발생 시 빈 JSON 반환
        }
    }
}
