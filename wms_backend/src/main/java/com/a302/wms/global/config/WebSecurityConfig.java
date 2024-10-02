package com.a302.wms.global.config;

import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.auth.service.CustomUserDetailsService;
import com.a302.wms.domain.user.service.UserServiceImpl;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.handler.ValidationExceptionHandler;
import com.a302.wms.global.response.BaseExceptionResponse;
import com.a302.wms.global.security.filter.JwtAuthenticationFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Component
public class WebSecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    protected SecurityFilterChain configure(
            HttpSecurity httpSecurity,
            ValidationExceptionHandler validationExceptionHandler,
            UserServiceImpl userService)
            throws Exception {

        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(CsrfConfigurer::disable)
                .httpBasic(HttpBasicConfigurer::disable)
                .sessionManagement(
                        sessionManagement ->
                                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request.anyRequest().permitAll())
//        .oauth2Login(
//            oauth2 ->
//                oauth2
//                    .loginPage("/oauth2/authorization/kakao") // 로그인 페이지 설정
//                    .successHandler(
//                        (request, response, authentication) -> {
//                          OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//                          Map<String, Object> attributes = oAuth2User.getAttributes();
//                          Map<String, Object> kakaoAccount =
//                              (Map<String, Object>) attributes.get("kakao_account");
//                          String userEmail = (String) kakaoAccount.get("email");
//
//                          String token = jwtProvider.create(USER, userEmail);
//                          response.addHeader("Authorization", "Bearer " + token);
//                          String jsonResponse =
//                              URLEncoder.encode(
//                                  "{\"code\":\"SU\", \"token\":\""
//                                      + token
//                                      + "\", \"userEmail\":\""
//                                      + userEmail
//                                      + "\"}",
//                                  StandardCharsets.UTF_8);
//                          response.sendRedirect(
//                              "https://i11a508.p.ssafy.io/oauth/callback?token="
//                                  + token); // 성공 후 리다이렉트
//                        }))
//        .exceptionHandling(
//            exceptionHandling ->
//                exceptionHandling.authenticationEntryPoint(new FailedAuthenticationEntryPoint()))
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

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authenticationProvider());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(customUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

//@Slf4j
//class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//    @Override
//    public void commence(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            AuthenticationException authException)
//            throws IOException, ServletException {
//        log.error("Authentication failed");
//
//        response.setContentType("application/json");
//        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//        response
//                .getWriter()
//                .write(new BaseExceptionResponse(ResponseEnum.VALIDATION_FAILED).toString());
//    }
//}
