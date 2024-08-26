package com.a508.wms.auth.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys; // Keys 클래스를 import 합니다.
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    /**
     * JWT 토큰을 생성합니다.
     *
     * @param userId 사용자 ID
     * @return 생성된 JWT 토큰
     */
    public String create(String userId){
        // 토큰 만료 시간을 현재 시간에서 1시간 후로 설정
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        // secretKey를 사용하여 HMAC SHA 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용

        // JWT 토큰 생성
        String jwt = Jwts.builder()
            .signWith(key, SignatureAlgorithm.HS256) // 수정: HS256 알고리즘 사용
            .setSubject(userId) // 토큰의 subject로 userId를 설정
            .setIssuedAt(new Date()) // 토큰 발행 시간 설정
            .setExpiration(expiredDate) // 토큰 만료 시간 설정
            .compact();

        /**
         * { "iat" : 1551515,  // 발행 시간
         *   "exp" : 12355454  // 만료 시간
         *   "sub" : "userId"  // 사용자 ID
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
    public String validate(String jwt){
        String subject = null;

        // secretKey를 사용하여 HMAC SHA 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용

        try{
            // JWT 토큰을 파싱하고 서명 검증
            subject = Jwts.parserBuilder()
                .setSigningKey(key) // 수정: setSigningKey 메서드 사용
                .build()
                .parseClaimsJws(jwt) // JWT 토큰을 파싱하여 클레임 추출
                .getBody()
                .getSubject(); // 클레임의 subject(사용자 ID)를 가져옴

        }catch (Exception exception){
            // 검증 실패 시 예외 출력
            exception.printStackTrace();
            return null;
        }
        // 검증 성공 시 사용자 ID 반환
        return subject;
    }
}
