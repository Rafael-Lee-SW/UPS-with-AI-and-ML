package com.a302.wms.global.security.filter;

import com.a302.wms.domain.auth.dto.Tokens;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.constant.TokenRoleTypeEnum;
import com.a302.wms.global.handler.CommonException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final RedisTemplate<String, String> redisTemplate;
    private final DeviceRepository deviceRepository;

    /**
     * 1. 토큰값이 null이 아니고
     * 2. 유효성이 null이 아니라면
     * 3. 유저정보를 꺼내온다
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. "Authorization" 헤더에서 Bearer 토큰을 가져옴
            String accessToken = parseBearerToken(request);

            // 2. 토큰이 null이면 다음 필터로 진행
            if (accessToken == null) {
                logger.info("Token is null.");
//                throw new CommonException(ResponseEnum.VALIDATION_FAILED, null);
                filterChain.doFilter(request, response);
                return;
            }

            // 3. refresh token 토큰 유효성 검증
            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            String refreshToken = ops.get(accessToken);
            if (refreshToken == null) {
//                throw new CommonException(ResponseEnum.INVALID_TOKEN, "로그인이 필요합니다.");
                logger.info("Invalid Token.");
                filterChain.doFilter(request, response);
                return;
            }

            // 4. 유효하지 않은 토큰이면 다음 필터로 진행
            Map<String, Object> claims;

            try {
                jwtProvider.isTokenExpired(accessToken);
            } catch (Exception e) {
                log.info("Token is expired.");
                refreshToken = ops.get(accessToken);
                claims = jwtProvider.getClaims(refreshToken);
                Tokens tokens = jwtProvider.create((TokenRoleTypeEnum) claims.get("type"), ((Long) claims.get("id")).toString());
                ops.set(tokens.accessToken(), tokens.refreshToken(), jwtProvider.getRefreshTokenExpire(), TimeUnit.SECONDS);
                redisTemplate.delete(accessToken);
                response.setHeader("Authorization", tokens.accessToken());
                accessToken = tokens.accessToken();
            }

            // 5. type과 id로 엔티티 조회
            claims = jwtProvider.getClaims(accessToken);
            authenticate(claims, request);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error during JWT authentication", e);
            throw new CommonException(ResponseEnum.INVALID_TOKEN, "로그인이 필요합니다.");
        }
    }

    private void authenticate(Map<String, Object> claims, HttpServletRequest request) {
        TokenRoleTypeEnum type = (TokenRoleTypeEnum) claims.get("type");
        Long id = (Long) claims.get("id");
        log.info("[AuthenticationFilter] type: {}, id: {}", type, id);


        if (type.equals(TokenRoleTypeEnum.USER)) {
            log.info("USER authentication");
            long userId = (Long) claims.get("id");
            User user = userRepository.findById(userId).orElseThrow(() -> {
                log.error("[AuthenticationFilter] User not found for ID: {}", id); // 로그 추가
                return new CommonException(ResponseEnum.INVALID_SIGNIN, null);
            });
            // 인증 정보 생성
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // SecurityContextHolder에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } else {
            long deviceId = (Long) claims.get("id");
            Device device = deviceRepository.findById(id).orElseThrow(() -> new CommonException(ResponseEnum.INVALID_SIGNIN, null));
            // 인증 정보 생성
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_DEVICE"));

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(deviceId, null, authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // SecurityContextHolder에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

    }


    /**
     * 1. "Authorization"  Bearer 토큰 가져오기
     * 2. 헤더가 비어있지 않은지 확인
     * 3. Bearer로 시작하는지 확인
     * 4. Bearer 다음의 실제 토큰 값을 추출
     *
     * @param request HTTP 요청 객체
     * @return 추출된 JWT 토큰
     */
    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (!StringUtils.hasText(bearerToken)) {
            return null;
        }

        if (!bearerToken.startsWith("Bearer ")) {
            return null;
        }

        return bearerToken.substring(7);
    }
}
