package com.a302.wms.domain.device.service;

import com.a302.wms.domain.device.entity.DeviceDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceKeyServiceImpl {

    private RedisTemplate<String, DeviceDetails> deviceKeyRedisTemplate;

}
