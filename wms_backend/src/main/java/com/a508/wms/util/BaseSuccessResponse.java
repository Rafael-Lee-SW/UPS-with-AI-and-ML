package com.a508.wms.util;

import static com.a508.wms.util.constant.ResponseEnum.SUCCESS;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.LocalDateTime;
import lombok.Getter;

/**
 * 성공여부, 상태코드, 메시지, 시간, 결과값을 담은 BaseSuccessResponse 클래스
 * 성공했을 때를 전제하므로 성공여부, 상태코드 고정. 결과값이 필요할 때만 담아서 리턴
 */
@Getter
@JsonPropertyOrder({"success", "statusCode", "httpStatus", "message", "timestamp", "result"})
public class BaseSuccessResponse<T> {

    private final boolean success;
    private final int statusCode;
    private final int httpStatus;
    private final String message;
    private final LocalDateTime timestamp;
    @JsonInclude(JsonInclude.Include.NON_NULL) //  JSON 출력에서 null이 아닌 속성만 포함.
    private final T result;

    public BaseSuccessResponse(T result) {
        this.success = true;
        this.statusCode = SUCCESS.getStatusCode();
        this.httpStatus = SUCCESS.getHttpStatus();
        this.message = SUCCESS.getMessage();
        this.result = result;
        this.timestamp = LocalDateTime.now().withNano(0);
    }
}
