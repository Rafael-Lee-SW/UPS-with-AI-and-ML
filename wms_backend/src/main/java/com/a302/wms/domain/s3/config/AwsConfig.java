package com.a302.wms.domain.s3.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class AwsConfig {

  private final AwsProperties awsProperties;

  @Autowired
  public AwsConfig(AwsProperties awsProperties) {
    this.awsProperties = awsProperties;
  }

  @Bean
  public AwsCredentialsProvider awsCredentialsProvider() {
    AwsBasicCredentials awsCreds = AwsBasicCredentials.create(
            awsProperties.getAccessKeyId(),
            awsProperties.getSecretKey()
    );
    return StaticCredentialsProvider.create(awsCreds);
  }

  @Bean
  public S3Client s3Client(AwsCredentialsProvider awsCredentialsProvider) {
    return S3Client.builder()
            .region(Region.of(awsProperties.getRegion()))
            .credentialsProvider(awsCredentialsProvider)
            .build();
  }

  @Bean
  public S3Presigner s3Presigner(AwsCredentialsProvider awsCredentialsProvider) {
    return S3Presigner.builder()
            .region(Region.of(awsProperties.getRegion()))
            .credentialsProvider(awsCredentialsProvider)
            .build();
  }
}
