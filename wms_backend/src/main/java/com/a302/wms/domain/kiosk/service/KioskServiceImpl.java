package com.a302.wms.domain.kiosk.service;

import com.a302.wms.domain.kiosk.dto.KioskDeleteRequestDto;
import com.a302.wms.domain.kiosk.dto.KioskKeyResponseDto;
import com.a302.wms.domain.kiosk.dto.KioskCreateRequestDto;
import com.a302.wms.domain.kiosk.dto.KioskResponseDto;
import com.a302.wms.domain.kiosk.entity.Kiosk;
import com.a302.wms.domain.kiosk.mapper.KioskMapper;
import com.a302.wms.domain.kiosk.repository.KioskRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KioskServiceImpl {

    private final KioskRepository kioskRepository;
    private final StoreRepository storeRepository;

    /**
     * user가 소유한 각 매장에 속한 kiosk들을 리턴합니다. 이 때, 키값은 리턴하지 않습니다. (개별 요청해야 보여줌)
     * @param userId
     * @return
     */
    public List<List<KioskResponseDto>> getUserKiosksList(Long userId) {
        log.info("[Service] get kiosk list of the user");

        //TODO: user validation

        List<Store> storeList = storeRepository.findByUserId(userId);
        List<List<KioskResponseDto>> userKioskList = new ArrayList<>();

        List<KioskResponseDto> storeKioskList;
        for (Store store : storeList) {
            storeKioskList = kioskRepository.findByStoreId(store.getId())
                    .stream()
                    .map(KioskMapper::toKioskResponseDto)
                    .toList();
            userKioskList.add(storeKioskList);
        }

        return userKioskList;
    }

    /**
     * 해당 키오스크가 유저에 속한 키오스크일 때, 키오스크 키를 포함한 키 정보를 리턴합니다.
     * @param userId
     * @param kioskId
     * @return
     */
    public KioskKeyResponseDto getKioskKey(Long userId, Long kioskId) {
        log.info("[Service] get kiosk key of the user");

        //TODO: user validation
//        User user = userRepository.findById(userId).orElseThrow();

        Kiosk kiosk = kioskRepository.findById(kioskId).orElseThrow();
//        if(kiosk.getUser().getId()!=user.getId()) throw new

        return KioskMapper.toKioskKeyDto(kiosk);
    }


    /**
     * 특정 매장에 속하는 키오스크를 등록합니다.
     * @param userId
     * @param kioskCreateRequestDto
     * @return
     */
    public KioskResponseDto saveKiosk(Long userId, KioskCreateRequestDto kioskCreateRequestDto) {
        log.info("[Service] create kiosk of the user");

        //TODO: user validation
//        User user = userRepository.findById(userId).orElseThrow();

        //TODO: store validation
        Store store = storeRepository.findById(kioskCreateRequestDto.storeId()).orElseThrow();
//        if(store.getUser().getId()!=user.getId()) throw

        //TODO: key validation with redis and delete

        Kiosk kiosk = kioskRepository.save(KioskMapper.toEntity(kioskCreateRequestDto, store));

        return KioskMapper.toKioskResponseDto(kiosk);
    }

    /**
     * 해당 키오스크를 삭제합니다.
     * @param userId
     * @param kioskDeleteRequestDto
     */
    public void deleteKiosk(Long userId, KioskDeleteRequestDto kioskDeleteRequestDto) {
        log.info("[Service] delete kiosk of the user");

        //TODO: user validation
//        User user = userRepository.findById(userId).orElseThrow();

        //TODO: store validation
        Store store = storeRepository.findById(kioskDeleteRequestDto.storeId()).orElseThrow();
//        if(store.getUser().getId()!=user.getId()) throw

        Kiosk existingKiosk = kioskRepository.findById(kioskDeleteRequestDto.kioskId()).orElseThrow();
        if(kioskDeleteRequestDto.kioskKey()==existingKiosk.getKioskKey()) {
            kioskRepository.delete(existingKiosk);
        }
//        else throw;
    }

}
