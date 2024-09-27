package com.a302.wms.domain.device.service;

import com.a302.wms.domain.device.dto.DeviceCreateRequest;
import com.a302.wms.domain.device.dto.DeviceKeyCreateRequest;
import com.a302.wms.domain.device.dto.DeviceDetailedResponse;
import com.a302.wms.domain.device.dto.DeviceResponse;
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
     * 해당 매장의 device를 새로 생성합니다.
     * @param deviceCreateRequest
     * @return
     */
    public DeviceResponse save(DeviceCreateRequest deviceCreateRequest) {
        log.info("[Service] create device of the deviceCreateRequest: {}", deviceCreateRequest);
        Store store = storeRepository.findById(deviceCreateRequest.storeId()).orElseThrow();

        Device device = DeviceMapper.fromCreateRequestDto(deviceCreateRequest, store);
        Device newDevice = deviceRepository.save(device);

        return DeviceMapper.toResponseDto(newDevice);
    }

    /**
     * user가 소유한 각 매장에 속한 device들을 리턴합니다. 이 때, 키값은 리턴하지 않습니다. (개별 요청해야 보여줌)
     * @param userId
     * @return
     */
    public List<List<DeviceResponse>> getUserDevicesList(Long userId) {
        log.info("[Service] get device list of the user");

        List<Store> storeList = storeRepository.findByUserId(userId);
        List<List<DeviceResponse>> userDeviceList = new ArrayList<>();

        List<DeviceResponse> storeDeviceList;
        for (Store store : storeList) {
            storeDeviceList = deviceRepository.findByStoreId(store.getId())
                    .stream()
                    .map(DeviceMapper::toResponseDto)
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
    public DeviceDetailedResponse getDetailedInfo(Long userId, Long deviceId) {
        log.info("[Service] get device key of the user");

        Device device = deviceRepository.findById(deviceId).orElseThrow();
        return DeviceMapper.toDetailedResponseDto(device);
    }


    /**
     * 해당 디바이스 (키오스크, CCTV)를 삭제합니다.
     * @param userId
     * @param deviceId
     */
    public void deleteDevice(Long userId, Long deviceId) {
        log.info("[Service] delete device of the user");
        //TODO user validation
        Device existingDevice = deviceRepository.findById(deviceId).orElseThrow();
        Store store = storeRepository.findById(existingDevice.getStore().getId()).orElseThrow();
        deviceRepository.delete(existingDevice);
    }

}
