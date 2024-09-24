//package com.a302.wms.global.config;
//
//import com.a302.wms.domain.device.entity.DeviceDetails;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@Configuration
////@EnableRedisRepositories
//public class RedisConfig {
//    @Value("${spring.data.redis.deviceKey.host}")
//    private String redisHost;
//    @Value("${spring.data.redis.deviceKey.port}")
//    private int redisPort;
//    @Value("${spring.data.redis.deviceKey.password}")
//    private String redisPassword;
//
//    @Bean
//    public RedisConnectionFactory deviceKeyRedisConnectionFactory() {
//        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
//        config.setHostName(redisHost);
//        config.setPort(redisPort);
//        config.setPassword(redisPassword);
//        return new LettuceConnectionFactory(config);
//    }
//
//    @Bean
//    public RedisTemplate<String, DeviceDetails> deviceKeyRedisTemplate() {
//        RedisTemplate<String, DeviceDetails> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setConnectionFactory(deviceKeyRedisConnectionFactory());
//        redisTemplate.setKeySerializer(new StringRedisSerializer());
//        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
//        return redisTemplate;
//    }
//
//    @Bean
//    public RedisConnectionFactory jwtRedisConnectionFactory() {
//        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
//        config.setHostName(redisHost);
//        config.setPort(redisPort);
//        config.setPassword(redisPassword);
//        return new LettuceConnectionFactory(config);
//    }
//
//    @Bean
//    public RedisTemplate<String, ?> jwtRedisTemplate() {
//        RedisTemplate<String, ?> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setConnectionFactory(jwtRedisConnectionFactory());
//        redisTemplate.setKeySerializer(new StringRedisSerializer());
//        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
//        return redisTemplate;
//    }
//}
