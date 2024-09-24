package com.a302.wms.domain.device.service;

import com.a302.wms.domain.device.dto.DeviceKeyCreateDto;
import com.a302.wms.domain.device.dto.DeviceKeyResponseDto;
import com.a302.wms.domain.device.dto.DeviceRegisterRequestDto;
import com.a302.wms.domain.device.dto.DeviceResponseDto;
import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.entity.DeviceDetails;
import com.a302.wms.domain.device.mapper.DeviceMapper;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceServiceImpl {

    private final DeviceRepository deviceRepository;
    private final StoreRepository storeRepository;

    /**
     * user가 소유한 각 매장에 속한 device들을 리턴합니다. 이 때, 키값은 리턴하지 않습니다. (개별 요청해야 보여줌)
     * @param userId
     * @return
     */
    public List<List<DeviceResponseDto>> getUserDevicesList(Long userId) {
        log.info("[Service] get device list of the user");

        //TODO: user validation

        List<Store> storeList = storeRepository.findByUserId(userId);
        List<List<DeviceResponseDto>> userDeviceList = new ArrayList<>();

        List<DeviceResponseDto> storeDeviceList;
        for (Store store : storeList) {
            storeDeviceList = deviceRepository.findByStoreId(store.getId())
                    .stream()
                    .map(DeviceMapper::toDeviceResponseDto)
                    .toList();
            userDeviceList.add(storeDeviceList);
        }

        return userDeviceList;
    }

    /**
     * 해당 디바이스 (키오스크, CCTV)가 유저에 속한 디바이스일 때, 디바이스키를 포함한 키 정보를 리턴합니다.
     * @param userId
     * @param deviceId
     * @return
     */
    public DeviceKeyResponseDto getDetailedInfo(Long userId, Long deviceId) {
        log.info("[Service] get device key of the user");

        //TODO: user validation
//        User user = userRepository.findById(userId).orElseThrow();

        Device device = deviceRepository.findById(deviceId).orElseThrow();
//        if(device.getUser().getId()!=user.getId()) throw new

        return DeviceMapper.toDeviceKeyDto(device);
    }

    public String createDeviceKey(/*Long userId,*/ DeviceKeyCreateDto dto) {
        log.info("[Service] create device key of the store: {}", dto);
        String key = UUID.randomUUID().toString();
        DeviceDetails deviceDetails = DeviceDetails.builder()
                .type(dto.deviceType())
                .storeId(dto.storeId())
                .build();
        return key;
    }

    /**
     * 특정 매장에 속하는 디바이스 (키오스크, CCTV)를 등록합니다.
     * @param deviceRegisterRequestDto
     * @return
     */

//    public DeviceResponseDto saveDevice(/*Long userId,*/ DeviceRegisterRequestDto deviceRegisterRequestDto) {
//        log.info("[Service] create device of the user");
//
//        //TODO: user validation
////        User user = userRepository.findById(userId).orElseThrow();
//
//        //TODO: store validation
////        Store store = storeRepository.findById(deviceCreateRequestDto.storeId()).orElseThrow();
////        if(store.getUser().getId()!=user.getId()) throw
//
//        //TODO: key validation with redis and delete
//
//        Device device = deviceRepository.save(DeviceMapper.toEntity(deviceRegisterRequestDto));
//
//        return DeviceMapper.toDeviceResponseDto(device);
//    }

    /**
     * 해당 디바이스 (키오스크, CCTV)를 삭제합니다.
     * @param userId
     * @param deviceId
     */
    public void deleteDevice(Long userId, Long deviceId) {
        log.info("[Service] delete device of the user");

        //TODO: user validation
//        User user = userRepository.findById(userId).orElseThrow();

        Device existingDevice = deviceRepository.findById(deviceId).orElseThrow();

        //TODO: store validation
        Store store = storeRepository.findById(existingDevice.getStore().getId()).orElseThrow();
//        if(store.getUser().getId()!=user.getId()) throw

        deviceRepository.delete(existingDevice);
//        else throw;
    }

}
