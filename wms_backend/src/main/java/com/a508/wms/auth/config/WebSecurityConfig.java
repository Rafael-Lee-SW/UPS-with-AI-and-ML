package com.a508.wms.auth.config;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import com.a508.wms.auth.filter.JwtAuthenticationFilter;
import com.a508.wms.auth.handler.ValidationExceptionHandler;
import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.user.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Component
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DefaultOAuth2UserService oAuth2UserService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final AuthenticationSuccessHandler customSuccessHandler;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity,
        ValidationExceptionHandler validationExceptionHandler, UserService userService)
        throws Exception {

        httpSecurity
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())
            )
            .csrf(CsrfConfigurer::disable)
            .httpBasic(HttpBasicConfigurer::disable)
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(request -> request
                .requestMatchers("/**").permitAll()
                .requestMatchers("/api/v1/auth/**", "/", "/oauth2/**").permitAll()
                .requestMatchers("/api/oauth/code/kakao").permitAll()
                .requestMatchers("/api/oauth2/code/kakao").permitAll()
                .requestMatchers("/api/v1/social/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                    .loginPage("/oauth2/authorization/kakao")  // 로그인 페이지 설정
//                .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/kakao"))  // 리다이렉션 엔드포인트 설정
                    .successHandler((request, response, authentication) -> {
                        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                        Map<String, Object> attributes = oAuth2User.getAttributes();
                        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get(
                            "kakao_account");
                        String userEmail = (String) kakaoAccount.get("email");

                        String token = jwtProvider.create(userEmail);
                        response.addHeader("Authorization", "Bearer " + token);
                        String jsonResponse = URLEncoder.encode(
                            "{\"code\":\"SU\", \"token\":\"" + token + "\", \"userEmail\":\""
                                + userEmail + "\"}", "UTF-8");
                        response.sendRedirect("https://i11a508.p.ssafy.io/oauth/callback?token="
                            + token);  // 성공 후 리다이렉트
                    })
            )
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(new FailedAuthenticationEntryPoint())
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}

/**
 * 인증 실패 시 처리할 클래스입니다.
 */
@Slf4j
class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException, ServletException {
        log.error("Authentication failed: {}", authException.getMessage());

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write(
            "{\"code\":\"" + ResponseCode.SIGN_IN_FAIL + "\" , \"message\":\""
                + ResponseMessage.SIGN_IN_FAIL + "\"}");
    }
}
