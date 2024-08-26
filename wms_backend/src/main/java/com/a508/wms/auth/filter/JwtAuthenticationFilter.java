package com.a508.wms.auth.filter;
import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    /**
     * 1. 토큰값이 null이 아니고
     * 2. 유효성이 null이 아니라면
     * 3. 유저정보를 꺼내온다
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. "Authorization" 헤더에서 Bearer 토큰을 가져옴
            String token = parseBearerToken(request);
            logger.info("Token: {}", token);

            // 2. 토큰이 null이면 다음 필터로 진행
            if (token == null) {
                logger.info("Token is null, proceeding to next filter.");
                filterChain.doFilter(request, response);
                return;
            }

            // 3. 토큰 유효성 검증
            String userId = jwtProvider.validate(token);
            logger.info("UserId: {}", userId);

            // 4. 유효하지 않은 토큰이면 다음 필터로 진행
           try {
                userId = jwtProvider.validate(token);
                logger.info("UserId: {}", userId);
            } catch (Exception e) {
                logger.error("Invalid JWT token", e);
                filterChain.doFilter(request, response);
                return;
            }

            // 5. 유저 ID로 User 엔티티 조회
            User user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            logger.info("User: {}", user);

            // 6. User 엔티티가 없을 경우 다음 필터로 진행
            if (user == null) {
                logger.info("User entity not found, proceeding to next filter.");
                filterChain.doFilter(request, response);
                return;
            }

            // 7. User 엔티티에서 role 가져오기
            String role = user.getRoleTypeEnum().name();
            List<GrantedAuthority> authorities = new ArrayList<>();

            // 역할에 따라 권한 부여
            switch (role) {
                case "ADMIN":
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    break;
                case "EMPLOYEE":
                    authorities.add(new SimpleGrantedAuthority("ROLE_EMPLOYEE"));
                    break;
                case "BUSINESS":
                    authorities.add(new SimpleGrantedAuthority("ROLE_BUSINESS"));
                    break;
                default:
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    break;
            }

            // 8. 빈 SecurityContext 생성
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

            // 9. Authentication 토큰 생성 및 설정
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 10. SecurityContext에 Authentication 설정
            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);

        } catch (Exception e) {
            logger.error("Error during JWT authentication", e);
        }

        // 11. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * 1. "Authorization"  Bearer 토큰 가져오기
     * 2. 헤더가 비어있지 않은지 확인
     * 3. Bearer로 시작하는지 확인
     * 4. Bearer 다음의 실제 토큰 값을 추출
     * @param request HTTP 요청 객체
     * @return 추출된 JWT 토큰
     */
    private String parseBearerToken(HttpServletRequest request) {
        // 1. "Authorization" 헤더에서 Bearer 토큰 가져오기
        String bearerToken = request.getHeader("Authorization");
        logger.info("Authorization Header: {}", bearerToken);

        // 2. 헤더가 비어있지 않은지 확인
        if (!StringUtils.hasText(bearerToken)) {
            return null;
        }

        // 3. Bearer로 시작하는지 확인
        if (!bearerToken.startsWith("Bearer ")) {
            return null;
        }

        // 4. Bearer 다음의 실제 토큰 값을 추출
        return bearerToken.substring(7); // "Bearer "는 7자로 구성
    }
}
