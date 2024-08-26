package com.a508.wms.util.constant;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResponseEnum {
    SUCCESS(true, 1000, HttpStatus.OK.value(), "요청에 성공하였습니다."),  //성공 코드

    // Request 오류
    BAD_REQUEST(false, 2000, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 요청입니다."),
    URL_NOT_FOUND(false, 2001, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 URL 입니다."),
    METHOD_NOT_ALLOWED(false, 2002, HttpStatus.METHOD_NOT_ALLOWED.value(),
        "해당 URL에서는 지원하지 않는 HTTP Method 입니다."),

    // Server, Database 오류
    SERVER_ERROR(false, 3000, HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버에서 오류가 발생하였습니다."),
    DATABASE_ERROR(false, 3001, HttpStatus.INTERNAL_SERVER_ERROR.value(), "데이터베이스에서 오류가 발생하였습니다."),
    BAD_SQL_GRAMMAR(false, 3002, HttpStatus.INTERNAL_SERVER_ERROR.value(), "SQL에 오류가 있습니다."),

    // User 오류
    INVALID_USER_VALUE(false, 5000, HttpStatus.BAD_REQUEST.value(), "회원가입 요청에서 잘못된 값이 존재합니다."),
    DUPLICATE_EMAIL(false, 5001, HttpStatus.BAD_REQUEST.value(), "이미 존재하는 이메일입니다."),
    USER_NOT_FOUND(false, 5002, HttpStatus.BAD_REQUEST.value(), "존재하지 않는 회원입니다."),
    PASSWORD_NO_MATCH(false, 5003, HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."),
    USER_DELETED(false, 5004, HttpStatus.BAD_REQUEST.value(), "삭제된 사용자입니다."),
    USER_NOT_LOGGED_IN(false, 5005, HttpStatus.UNAUTHORIZED.value(), "로그인하지 않은 사용자입니다."),
    SAME_AS_OLD_PASSWORD(false, 5006, HttpStatus.BAD_REQUEST.value(), "새 비밀번호는 기존 비밀번호와 달라야 합니다."),
    INVALID_ROLE_TYPE(false, 5007, HttpStatus.BAD_REQUEST.value(), "해당 사용자의 직원 유형이 적절하지 않습니다."),
    //Product 오류
    PRODUCT_NOT_FOUND(false, 6000, HttpStatus.BAD_REQUEST.value(), "상품을 찾을수 없습니다."),
    PRODUCT_DELETED(false, 6001, HttpStatus.BAD_REQUEST.value(), "삭제된 상품입니다."),
    UNAVAILABLE_EXPORT_PRODUCT_SHORTAGE(false, 6002, HttpStatus.BAD_REQUEST.value(),
        "상품의 수량부족으로 출고가 불가합니다."),
    UNAVAILABLE_EXPORT_PRODUCT_MOVE(false, 6003, HttpStatus.BAD_REQUEST.value(),
        "상품의 위치 이동 후 출고가 가능합니다."),
    STORAGE_TYPE_NOT_MATCH(false, 6004, HttpStatus.BAD_REQUEST.value(),
        "상품의 보관타입이 이동하려는 로케이션의 보관타입과 일치하지 않습니다."),

    //Business 오류
    BUSINESS_NOT_FOUND(false, 7000, HttpStatus.BAD_REQUEST.value(), "사업체를 찾을수 없습니다."),
    BUSINESS_DELETED(false, 7001, HttpStatus.BAD_REQUEST.value(), "삭제된 사업체 입니다."),

    //ProductDetail 오류
    PRODUCT_DETAIL_NOT_FOUND(false, 8000, HttpStatus.BAD_REQUEST.value(), "상품 정보를 찾을수 없습니다."),
    PRODUCT_DETAIL_DELETED(false, 8001, HttpStatus.BAD_REQUEST.value(), "삭제된 상품정보 입니다."),

    //Floor 오류
    FLOOR_NOT_FOUND(false, 8000, HttpStatus.BAD_REQUEST.value(), "층을 찾을수 없습니다."),
    FLOOR_DELETED(false, 8001, HttpStatus.BAD_REQUEST.value(), "삭제된 층 입니다."),
    DEFAULT_FLOOR_NOT_FOUND(false, 8002, HttpStatus.BAD_REQUEST.value(),
        "Default Floor를 찾을수 없습니다."),
    INVALID_FLOOR_EXPORT_TYPE(false, 8003, HttpStatus.BAD_REQUEST.value(),
        "해당되는 창고에 적합하지 않는 출고 타입으로 층을 변경할수 없습니다."),

    //Location 오류
    LOCATION_NOT_FOUND(false, 9000, HttpStatus.BAD_REQUEST.value(), "로케이션을 찾을수 없습니다."),
    LOCATION_DELETED(false, 9001, HttpStatus.BAD_REQUEST.value(), "삭제된 로케이션 입니다."),
    DEFAULT_LOCATION_NOT_FOUND(false, 9002, HttpStatus.BAD_REQUEST.value(),
        "Default Location을 찾을수 없습니다."),
    INVALID_LOCATION_STORAGE_TYPE(false, 9003, HttpStatus.BAD_REQUEST.value(),
        "해당 로케이션에 속해있는 상품들로 인해 보관 타입을 변경할수 없습니다."),

    //Warehouse 오류
    WAREHOUSE_NOT_FOUND(false, 10000, HttpStatus.BAD_REQUEST.value(), "창고를 찾을수 없습니다."),
    WAREHOUSE_DELETED(false, 10001, HttpStatus.BAD_REQUEST.value(), "삭제된 창고 입니다."),
    INVALID_WAREHOUSE_TYPE(false, 10002, HttpStatus.BAD_REQUEST.value(),
        "해당 창고에 속해있는 로케이션들로 인해 warehouse의 타입을 변경할수 없습니다."),

    //Subscription 오류
    SUBSCRIPTION_NOT_FOUND(false, 11000, HttpStatus.BAD_REQUEST.value(), "구독 정보를 찾을수 없습니다."),
    SUBSCRIPTION_DELETED(false, 11001, HttpStatus.BAD_REQUEST.value(), "삭제된 구독정보 입니다.");


    private final boolean success;  //성공여부
    private final int statusCode;
    private final int httpStatus; //HTTP 상태코드
    private final String message; //메시지

    ResponseEnum(boolean success, int statusCode, int httpStatus, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.message = message;
    }

}
