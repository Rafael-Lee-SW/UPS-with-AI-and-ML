package com.a302.wms.domain.camera.service;

import com.a302.wms.domain.camera.dto.CameraResponse;
import com.a302.wms.domain.camera.entity.Camera;
import com.a302.wms.domain.camera.mapper.CameraMapper;
import com.a302.wms.domain.camera.repository.CameraRepository;
import com.a302.wms.domain.camera.resource.MultipartInputStreamFileResource;
import com.a302.wms.domain.notification.entity.Notification;
import com.a302.wms.domain.notification.service.NotificationServiceImpl;
import com.a302.wms.domain.s3.service.S3ServiceImpl;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.CrimePreventionEnum;
import com.a302.wms.global.constant.NotificationTypeEnum;
import com.a302.wms.global.constant.ProductConstant;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class CameraServiceImpl {

  private final UserRepository userRepository;
  private final StoreRepository storeRepository;
  private final NotificationServiceImpl notificationServiceImpl;
  private final CameraRepository cameraRepository;
  private final S3ServiceImpl s3ServiceImpl;
  private final ObjectMapper objectMapper;

  @Value("${cctv-base-url}")
  private String cctvBaseUrl;

  /**
   * 비디오 업로드를 처리하고 범죄 유형을 반환하는 메서드
   *
   * @param file 업로드할 MultipartFile
   * @param userId
   * @param storeId
   * @return 범죄 유형의 한글 값
   * @throws Exception 업로드 또는 처리 중 발생한 예외
   */
  @Transactional
  public String processVideoUpload(MultipartFile file, Long userId, Long storeId) throws Exception {
    log.info("[Service] processVideoUpload ");
    // 비디오 업로드
    String uploadResponse = uploadVideo(file);
    Notification notification =
        Notification.builder()
            .user(userRepository.findById(userId).orElse(null))
            .store(storeRepository.findById(storeId).orElse(null))
            .isImportant(false)
            .isRead(false)
            .notificationTypeEnum(NotificationTypeEnum.CRIME_PREVENTION)
            .message(ProductConstant.DEFAULT_NOTIFICATION_CRIME_MESSAGE)
            .build();
    // 테이블 저장
    notificationServiceImpl.save(notification);
    cameraRepository.save(
        Camera.builder()
            .notification(notification)
            .title(file.getOriginalFilename())
            .url(s3ServiceImpl.generatePresignedUrl(file.getOriginalFilename()).downloadLink())
            .category(returnResponse(uploadResponse))
            .build());
    // 응답 처리
    return returnResponse(uploadResponse);
  }

  /**
   * 비디오 파일을 업로드하는 메서드
   *
   * @param file 업로드할 MultipartFile
   * @return 업로드 응답 문자열
   * @throws Exception 업로드 중 발생한 예외
   */
  public String uploadVideo(MultipartFile file) throws Exception {
    log.info("[Service] uploadVideo by file : {}", file.getOriginalFilename());
    WebClient client =
        WebClient.builder()
            .baseUrl(cctvBaseUrl)
            .defaultHeader("Content-Type", MediaType.MULTIPART_FORM_DATA_VALUE)
            .clientConnector(
                new ReactorClientHttpConnector(
                    HttpClient.create().option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)))
            .build();

    MultiValueMap<String, Object> body = createBody(file);
    log.info("[Service] body Data : {}", body.get("data"));
    String response =
        client
            .post()
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .body(BodyInserters.fromMultipartData(body))
            .retrieve()
            .bodyToMono(String.class)
            .block();

    if (response == null) {
      throw new RestClientException("응답이 없습니다.");
    }
    return getCrime(response);
  }

  /**
   * 응답 문자열에서 "class" 키의 값을 추출하고 범죄 유형의 한글 값을 반환하는 메서드
   *
   * @param response 업로드 응답 문자열
   * @return 범죄 유형의 한글 값
   * @throws Exception JSON 파싱 또는 범죄 유형 매핑 중 발생한 예외
   */
  public String returnResponse(String response) throws Exception {
    if (response == null) {
      throw new IllegalArgumentException("응답이 null입니다.");
    }
    String crimeValue = CrimePreventionEnum.getCrimeValue(response);
    if (crimeValue == null) {
      throw new IllegalArgumentException("알 수 없는 범죄 유형입니다: " + response);
    }
    return crimeValue;
  }

  /**
   * JSON 응답 문자열에서 "class" 키의 값을 추출하는 메서드
   *
   * @param response JSON 응답 문자열
   * @return "class" 키의 값
   * @throws Exception JSON 파싱 오류
   */
  public String getCrime(String response) throws Exception {
    try {
      JsonNode jsonObject = objectMapper.readTree(response);
      if (jsonObject == null || !jsonObject.has("class")) {
        throw new IllegalArgumentException("\"class\" 키가 존재하지 않습니다.");
      }
      return jsonObject.get("class").asText();
    } catch (Exception e) {
      log.error("JSON 파싱 오류", e);
      throw new Exception("JSON 파싱 오류: " + e.getMessage(), e);
    }
  }

  /**
   * 멀티파트 폼 데이터를 생성하는 메서드
   *
   * @param file 업로드할 MultipartFile
   * @return 멀티파트 폼 데이터
   * @throws IOException 파일 입력 스트림 오류
   */
  public MultiValueMap<String, Object> createBody(MultipartFile file) throws IOException {
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    Resource fileResource =
        new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename());
    log.info("[Service] createBody, file length : {}", fileResource.contentLength());
    body.add("data", fileResource);
    return body;
  }

  public CameraResponse findCameraByNotificationId(Long notificationId) {
    return CameraMapper.toCameraResponse(cameraRepository.findByNotificationId(notificationId));
  }

  public List<CameraResponse> findAllByStoreId(Long storeId) {
    return cameraRepository.findAllByStoreId(storeId);
  }
}
