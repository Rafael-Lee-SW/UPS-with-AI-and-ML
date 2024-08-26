package com.a508.wms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration

public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        Info info = new Info()
                .version("v1.0") //버전
                .title("WMS API") //이름
                .description("Wms 스웨거 입니다 "); //설명
        return new OpenAPI()
                .info(info);
    }

    @Bean
    public OpenAPI businessApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Business API")
                        .description("사업체 관리 API")
                        .version("1.0.0")
                );
    }

    @Bean
    public OpenAPI employeeApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Employee API")
                        .description("직원 관리 API")
                        .version("1.0.0")
                );
    }
}