package com.a302.wms.domain.s3.controller;

import com.a302.wms.domain.s3.dto.S3DownloadLinkResponse;
import com.a302.wms.domain.s3.service.S3ServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3ServiceImpl s3ServiceImpl;

    @GetMapping("/download/{filename}")
    public BaseSuccessResponse<S3DownloadLinkResponse> getDownloadLink(@PathVariable String filename) {
        return new BaseSuccessResponse<>(s3ServiceImpl.generatePresignedUrl(filename));

    }
}
