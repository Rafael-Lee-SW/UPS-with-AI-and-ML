package com.a302.wms.domain.s3.dto;

import lombok.Builder;

@Builder
public record S3DownloadLinkResponse(String downloadLink) {}
