package com.a508.wms.auth.common;

public interface ResponseMessage {
    String SUCCESS = "Success.";
    String VALIDATION_FAIL = "Validation Failed.";
    String DUPLICATE = "Duplicate Email.";
    String SIGN_IN_FAIL = "Login information mismatch.";
    String CERTIFICATION_FAIL = "Certification Failed.";

    String MAIL_FAIL = "Mail Send Failed.";
    String DATABASE_ERROR = "Database Error.";

}
