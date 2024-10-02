package com.a302.wms.domain.auth.service;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.DeviceTypeEnum;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.constant.TokenRoleTypeEnum;
import com.a302.wms.global.handler.CommonException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;

    @Override
    public UserDetails loadUserByUsername(String typeAndId) throws UsernameNotFoundException {
        log.info("loadUserByUsername: {}", typeAndId);
        String[] parts = typeAndId.split("-type-and-id-");
        if (parts.length != 2) {
            throw new CommonException(ResponseEnum.VALIDATION_FAILED, "loadUserByUsername failed");
        }

        String type = parts[0];
        Long id = Long.parseLong(parts[1]);

        if ("user".equalsIgnoreCase(type)) {
            return loadUserById(id);
        } else if ("device".equalsIgnoreCase(type)) {
            return loadDeviceById(id);
        } else {
            throw new CommonException(ResponseEnum.VALIDATION_FAILED, "loadUserByUsername failed22");
        }

    }

    private UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(()->new CommonException(ResponseEnum.VALIDATION_FAILED, "loadUserByUsername failed"));
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new CustomUserDetails(id, TokenRoleTypeEnum.USER, user.getEmail(), user.getPassword(), authorities);
    }

    private UserDetails loadDeviceById(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new CommonException(ResponseEnum.VALIDATION_FAILED, "loadDeviceByUsername failed"));

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_DEVICE"));

        TokenRoleTypeEnum type = (device.getDeviceType()== DeviceTypeEnum.KIOSK)?TokenRoleTypeEnum.KIOSK:TokenRoleTypeEnum.CAMERA;

        return new CustomUserDetails(device.getId(), type, authorities);
    }
}

class CustomUserDetails implements UserDetails {

    @Getter
    private Long id;  // User 또는 Device의 식별자
    @Getter
    private TokenRoleTypeEnum type;  // user 또는 device 타입을 구분
    private String username;  // user의 email 또는 device의 id
    private String password;  // user의 비밀번호 (device는 사용하지 않음)
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Long id, TokenRoleTypeEnum type, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.type = type;
        this.username = null;
        this.password = null;
        this.authorities = authorities;
    }

    public CustomUserDetails(Long id, TokenRoleTypeEnum type, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.type = type;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

}
