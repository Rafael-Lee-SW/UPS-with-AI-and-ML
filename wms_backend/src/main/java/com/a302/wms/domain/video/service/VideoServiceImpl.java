package com.a302.wms.domain.video.service;

import com.a302.wms.global.constant.CrimePreventionEnum;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.nio.file.Paths;
import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoServiceImpl {

    public void uploadVideo() {
        // 서버의 올바른 업로드 엔드포인트 URL로 수정
        WebClient client = WebClient.create("http://70.12.130.111:8880/predictions/ensemble");

        MultiValueMap<String, Object> body = createBody();

        Mono<String> response = client.post()
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(body)) // multipart/form-data로 수정
                .retrieve()
                .bodyToMono(String.class);
        response.subscribe(
                result ->
                   System.out.println(CrimePreventionEnum.isExist(result))
                ,
                error -> {
                    System.err.println("Error: " + error.getMessage());
                },
                () -> System.out.println("Completed")
        );
    }

    public MultiValueMap<String, Object> createBody() {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        String videoPath = Paths.get("video", "test.mp4").toString(); // 실제 파일 경로 확인
        File file = new File(videoPath);
        if (!file.exists()) {
            log.error("File not found: {}", file.getAbsolutePath());
            throw new RuntimeException("File not found: " + videoPath);
        }
        Resource fileResource = new FileSystemResource(file);
        body.add("data", fileResource);
        return body;
    }

}
