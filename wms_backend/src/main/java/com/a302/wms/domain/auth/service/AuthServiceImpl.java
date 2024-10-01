package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.request.DeviceSignInRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.AccessTokenResponse;
import com.a302.wms.domain.auth.mapper.AuthMapper;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.certification.provider.EmailProvider;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.DeviceTypeEnum;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.constant.TokenRoleTypeEnum;
import com.a302.wms.global.handler.CommonException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    static final int REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7;
    static final int TOKEN_SPLIT_INDEX = 7;

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final EmailProvider emailProvider;
    //    private final CertificationRepository certificationRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스
    private final OtpServiceImpl otpService;
    private final RedisTemplate<String, String> redisTemplate;
    private final DeviceRepository deviceRepository;
//    private final CertificationRedisRepository certificationRedisRepository;


    /**
     * OTP로 Device 로그인
     *
     * @param deviceOtpSingInRequest
     * @return
     */
    public AccessTokenResponse deviceSignIn(DeviceSignInRequest deviceOtpSingInRequest) {
        Long deviceId = otpService.verifyDeviceOtp(deviceOtpSingInRequest.deviceOtp());
        Device device = deviceRepository.findById(deviceId).orElseThrow(() -> new CommonException(ResponseEnum.DEVICE_NOT_FOUND, null));
        TokenRoleTypeEnum roleType = (device.getDeviceType() == DeviceTypeEnum.KIOSK) ? TokenRoleTypeEnum.KIOSK : TokenRoleTypeEnum.CAMERA;
        return createToken(roleType, deviceId);
    }

    /**
     * 유저 로그인
     *
     * @param signInRequest
     * @return
     */
    public AccessTokenResponse signIn(SignInRequest signInRequest) {
        log.info("[Service] signIn request: {}", signInRequest);
        String userEmail = signInRequest.email();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new CommonException(ResponseEnum.INVALID_SIGNIN, null));

        String password = signInRequest.password();
        String encodedPassword = passwordEncoder.encode(password);
        if (passwordEncoder.matches(user.getPassword(), encodedPassword)) {
            throw new CommonException(ResponseEnum.INVALID_SIGNIN, null);
        }

        return createToken(TokenRoleTypeEnum.USER, user.getId());

    }

    private AccessTokenResponse createToken(TokenRoleTypeEnum tokenRoleTypeEnum, Long id) {
        String accessToken = jwtProvider.create(tokenRoleTypeEnum, id.toString());
        String refreshToken = UUID.randomUUID().toString();

        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.set(accessToken, refreshToken, REFRESH_TOKEN_TTL, TimeUnit.SECONDS); // redis set 명령어
        return AuthMapper.fromAccessToken(accessToken);
    }

    /**
     * 유저, 디바이스 로그아웃
     *
     * @param header
     */
    public void signOut(String header) {
        String accessToken = header.substring(TOKEN_SPLIT_INDEX);

        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.getAndDelete(accessToken);
    }

    /**
     * access token 만료 시 access token과 refresh token 재생성
     *
     * @param accessToken
     * @return
     */
    public AccessTokenResponse refreshToken(String accessToken) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String refreshToken = ops.get(accessToken);
        if (refreshToken == null) throw new CommonException(ResponseEnum.INVALID_TOKEN, null);

        ops.getAndDelete(accessToken);
        long userId = jwtProvider.validate(accessToken);

        return createToken(TokenRoleTypeEnum.USER, userId);
    }
}


