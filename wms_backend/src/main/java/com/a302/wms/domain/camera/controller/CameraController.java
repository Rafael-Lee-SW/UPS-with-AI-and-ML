package com.a302.wms.domain.camera.controller;

import com.a302.wms.domain.camera.service.CameraServiceImpl;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.response.BaseExceptionResponse;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/cameras")
@RequiredArgsConstructor
@Slf4j
public class CameraController {

  private final CameraServiceImpl cameraServiceImpl;

  @PostMapping
  public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      // BaseExceptionResponse 사용하여 응답
      BaseExceptionResponse errorResponse =
          new BaseExceptionResponse(
              false,
              ResponseEnum.CAMERA_NOT_FOUND.getStatusCode(),
              HttpStatus.BAD_REQUEST.value(),
              "파일이 비었습니다");
      return ResponseEntity.badRequest().body(errorResponse);
    }
    try {
      String processedResult = cameraServiceImpl.processVideoUpload(file);
      BaseSuccessResponse<String> successResponse = new BaseSuccessResponse<>(processedResult);
      return ResponseEntity.ok(successResponse);
    } catch (Exception e) {
      log.error("Error uploading file", e);
      BaseExceptionResponse errorResponse =
          new BaseExceptionResponse(
              false,
              ResponseEnum.SERVER_ERROR.getStatusCode(),
              HttpStatus.INTERNAL_SERVER_ERROR.value(),
              "Error uploading file: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }
}
