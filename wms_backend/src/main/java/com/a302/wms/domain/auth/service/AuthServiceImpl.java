package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.auth.dto.Tokens;
import com.a302.wms.domain.auth.dto.request.DeviceSignInRequest;
import com.a302.wms.domain.auth.dto.request.SignInRequest;
import com.a302.wms.domain.auth.dto.response.DeviceSignInResponse;
import com.a302.wms.domain.auth.dto.response.UserSignInResponse;
import com.a302.wms.domain.auth.mapper.AuthMapper;
import com.a302.wms.domain.auth.provider.JwtProvider;
import com.a302.wms.domain.device.dto.DeviceResponse;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.mapper.DeviceMapper;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.product.dto.ProductResponse;
import com.a302.wms.domain.product.mapper.ProductMapper;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.user.dto.UserResponse;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.mapper.UserMapper;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.domain.user.service.UserServiceImpl;
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

import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    static final int TOKEN_SPLIT_INDEX = 7;

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스
    private final OtpServiceImpl otpService;
    private final RedisTemplate<String, String> redisTemplate;
    private final DeviceRepository deviceRepository;
    private final UserServiceImpl userServiceImpl;
    private final ProductRepository productRepository;


    /**
     * OTP로 Device 로그인
     *
     * @param deviceOtpSingInRequest
     * @return
     */
    public DeviceSignInResponse deviceSignIn(DeviceSignInRequest deviceOtpSingInRequest) {
        Long deviceId = otpService.verifyDeviceOtp(deviceOtpSingInRequest.deviceOtp());
        Device device = deviceRepository.findById(deviceId).orElseThrow(() -> new CommonException(ResponseEnum.DEVICE_NOT_FOUND, null));
        DeviceResponse deviceResponse = DeviceMapper.toResponseDto(device);

        TokenRoleTypeEnum roleType = (device.getDeviceType() == DeviceTypeEnum.KIOSK) ? TokenRoleTypeEnum.KIOSK : TokenRoleTypeEnum.CAMERA;

        if (device.getDeviceType().equals(DeviceTypeEnum.KIOSK)) {
            List<ProductResponse> productResponseList = productRepository.findByStoreId(device.getStore().getId())
                    .stream()
                    .map(ProductMapper::toProductResponse)
                    .toList();

            return AuthMapper.fromDeviceToken(createToken(roleType, deviceId), deviceResponse, productResponseList, device.getStore().getStoreName());
        } else
            return AuthMapper.fromDeviceToken(createToken(roleType, deviceId), deviceResponse, null, device.getStore().getStoreName());
    }

    /**
     * 유저 로그인
     *
     * @param signInRequest
     * @return
     */
    public UserSignInResponse signIn(SignInRequest signInRequest) {
        log.info("[Service] signIn request: {}", signInRequest);
        String userEmail = signInRequest.email();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new CommonException(ResponseEnum.INVALID_SIGNIN, null));
        UserResponse userResponse = UserMapper.toUserResponse(user);

        String password = signInRequest.password();
        String encodedPassword = passwordEncoder.encode(password);
        if (passwordEncoder.matches(user.getPassword(), encodedPassword)) {
            throw new CommonException(ResponseEnum.INVALID_SIGNIN, null);
        }

        return AuthMapper.fromUserToken(createToken(TokenRoleTypeEnum.USER, user.getId()), userResponse);
    }

    private String createToken(TokenRoleTypeEnum tokenRoleTypeEnum, Long id) {
        log.info("[Service] createToken tokenRoleTypeEnum: {} - {}", tokenRoleTypeEnum, id);

        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        Tokens tokens = jwtProvider.create(tokenRoleTypeEnum, id.toString());
        ops.set(tokens.accessToken(), tokens.refreshToken(), jwtProvider.getRefreshTokenExpire(), TimeUnit.SECONDS); // redis set 명령어
        return tokens.accessToken();
    }

    /**
     * 유저, 디바이스 로그아웃
     *
     * @param header
     */
    public void signOut(String header) {
        log.info("[Service] signOut request: {}", header);
        String accessToken = header.substring(TOKEN_SPLIT_INDEX);
        redisTemplate.delete(accessToken);
    }

    public UserResponse socialSignIn(String email) {
        log.info("get user email {}", email);
        // 토큰과 이메일을 검증하여 사용자 정보 반환
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CommonException(ResponseEnum.USER_NOT_FOUND, "등록된 유저가 없습니다."));
        return UserMapper.toUserResponse(user);
    }

}


