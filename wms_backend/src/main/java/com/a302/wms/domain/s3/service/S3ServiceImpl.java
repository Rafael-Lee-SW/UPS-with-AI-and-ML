package com.a302.wms.domain.s3.service;

import com.a302.wms.domain.s3.dto.S3DownloadLinkResponse;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
public class S3ServiceImpl {

  private final S3Presigner s3Presigner;
  private final String bucketName;

  public S3ServiceImpl(S3Presigner s3Presigner, @Value("${aws.s3.bucket}") String bucketName) {
    this.s3Presigner = s3Presigner;
    this.bucketName = bucketName;
  }

  public S3DownloadLinkResponse generatePresignedUrl(String objectKey) {
    GetObjectRequest getObjectRequest =
        GetObjectRequest.builder().bucket(bucketName).key(objectKey).build();

    GetObjectPresignRequest presignRequest =
        GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofDays(7)) // URL 유효 기간 설정
            .getObjectRequest(getObjectRequest)
            .build();
    String url = s3Presigner.presignGetObject(presignRequest).url().toString();
    return S3DownloadLinkResponse.builder().downloadLink(url).build();
  }
}
