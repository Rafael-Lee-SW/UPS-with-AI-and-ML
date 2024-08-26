package com.a508.wms.auth.config;

import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mapping.SimpleAssociationHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler  {


    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String userEmail = (String) kakaoAccount.get("email");
        log.info("kakao login userEmail = {} ",userEmail);

        String token = jwtProvider.create(userEmail);
        response.addHeader("Authorization", "Bearer " + token);
        String jsonResponse = URLEncoder.encode("{\"code\":\"SU\", \"token\":\"" + token + "\", \"userEmail\":\"" + userEmail + "\"}", "UTF-8");
        log.info("jsonResponse: {}", jsonResponse);
        response.sendRedirect("https://i11a508.p.ssafy.io/oauth/callback?token="+jsonResponse);

    }

}
