package com.a508.wms.auth.exception;

// 중복된 이메일에 대한 사용자 정의 예외 클래스
public class DuplicatedEmailException extends RuntimeException {
    public DuplicatedEmailException(String message) {
        super(message);
    }
}
