package com.a508.wms.subscription.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class SubscriptionException extends Throwable {

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public SubscriptionException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = exceptionMessage;
    }

    public static class NotFountException extends SubscriptionException {

        private static final String MESSAGE_FORMAT = " 구독 정보 id: %s";

        NotFountException(Long id) {
            super(ResponseEnum.SUBSCRIPTION_NOT_FOUND,
                String.format(ResponseEnum.SUBSCRIPTION_NOT_FOUND.getMessage() + MESSAGE_FORMAT,
                    id));
        }
    }

    public static class DeletedException extends SubscriptionException {

        private static final String MESSAGE_FORMAT = " 구독 정보 id: %s";

        DeletedException(Long id) {
            super(ResponseEnum.SUBSCRIPTION_DELETED,
                String.format(ResponseEnum.SUBSCRIPTION_DELETED.getMessage() + MESSAGE_FORMAT, id));
        }
    }
}
