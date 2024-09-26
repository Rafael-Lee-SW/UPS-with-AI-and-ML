package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.DeviceOtpCreateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl {

    private final StringRedisTemplate redisTemplate;
    static final int OTP_TTL = 5 * 60;

    public ResponseEntity<String> createDeviceOtp(DeviceOtpCreateRequest deviceOtpCreateRequest) {
        log.info("[Service] create device otp");
        try {
            // TODO: 사용자 검증

            String otpString = createRandomOTP();
            String deviceId = deviceOtpCreateRequest.deviceId().toString();

            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            ops.set(otpString, deviceId, OTP_TTL, TimeUnit.SECONDS); // redis set 명령어

            return ResponseEntity.ok(otpString);
        } catch (Exception e) {
            log.error("[Service] create device otp error {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    public Long verifyDeviceOtp(String otp) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String value = ops.get(otp);
//        if (value == null) throw ;
        Long deviceId = Long.parseLong(ops.get(otp));

        return deviceId;
    }


    // 랜덤한 6자리 OTP 생성
    private String createRandomOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);  // 6자리 OTP 생성
        return String.valueOf(otp);
    }
}
