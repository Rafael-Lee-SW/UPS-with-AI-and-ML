package com.a302.wms.domain.camera.service;

import com.a302.wms.domain.camera.resource.MultipartInputStreamFileResource;
import com.a302.wms.global.constant.CrimePreventionEnum;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class CameraServiceImpl {

  @Value("${cctv-base-url}")
  private String cctvBaseUrl;

  private final ObjectMapper objectMapper;

  /**
   * 비디오 업로드를 처리하고 범죄 유형을 반환하는 메서드
   *
   * @param file 업로드할 MultipartFile
   * @return 범죄 유형의 한글 값
   * @throws Exception 업로드 또는 처리 중 발생한 예외
   */
  public String processVideoUpload(MultipartFile file) throws Exception {
    // 비디오 업로드
    String uploadResponse = uploadVideo(file);
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
    WebClient client = WebClient.create(cctvBaseUrl);
    MultiValueMap<String, Object> body = createBody(file);

    String response = client
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
    Resource fileResource = new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename());
    body.add("data", fileResource);
    return body;
  }
}
