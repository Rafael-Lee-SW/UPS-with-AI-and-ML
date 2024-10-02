package com.a302.wms.domain.auth.provider;


import com.a302.wms.global.constant.TokenRoleTypeEnum;
import com.a302.wms.global.handler.CommonException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.a302.wms.global.constant.ResponseEnum.INVALID_TOKEN;


@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    /**
     * JWT 토큰을 생성합니다.
     *
     * @param type user, device, cctv 타입
     * @param id   userId, deviceId, cctvId 중 하나
     * @return
     */
    public String create(TokenRoleTypeEnum type, String id) {
        // 토큰 만료 시간을 현재 시간에서 1시간 후로 설정
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        // secretKey를 사용하여 HMAC SHA 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용

        // JWT 토큰 생성
        String jwt = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256) // 수정: HS256 알고리즘 사용
                .claim("type", type.getValue())
                .setSubject(id) // 토큰의 subject로 userId를 설정
                .setIssuedAt(new Date()) // 토큰 발행 시간 설정
                .setExpiration(expiredDate) // 토큰 만료 시간 설정
                .compact();

        /**
         * { "iat" : 1551515,  // 발행 시간
         *   "exp" : 12355454  // 만료 시간
         *   "sub" : "id"  // 사용자 ID
         *   "type" : ,user, cctv, device 저장
         * }
         */
        return jwt;
    }

    /**
     * JWT 토큰을 검증합니다.
     *
     * @param jwt 검증할 JWT 토큰
     * @return 토큰이 유효하면 사용자 ID, 유효하지 않으면 null
     */
    public Map<String, Object> validate(String jwt) {
        Long id = null;
        String type = null;

        // secretKey를 사용하여 HMAC SHA 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용


        if(isTokenExpired(jwt)) throw new CommonException(INVALID_TOKEN, null);

        try {
            // JWT 토큰을 파싱하고 서명 검증
            Claims claims = extractAllClaims(jwt);

            id = Long.parseLong(claims.getSubject());
            type = claims.get("type", String.class);

        } catch (Exception exception) {
            // 검증 실패 시 예외 출력
            throw new CommonException(INVALID_TOKEN, null);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("type", TokenRoleTypeEnum.fromValue(type));

        // 검증 성공 시 사용자 ID 반환
        return result;
    }


    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private @NotNull SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
}
