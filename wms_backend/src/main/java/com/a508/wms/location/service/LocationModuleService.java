package com.a508.wms.location.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.repository.LocationRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationModuleService {

    private final LocationRepository locationRepository;
    private final FloorModuleService floorModuleService;

    /**
     * 모든 로케이션 반환
     *
     * @return 모든 로케이션
     */
    public List<Location> findAll() {
        return locationRepository.findAll();
    }

    /**
     * 특정 로케이션 조회
     *
     * @param locationId: location id
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public Location findById(Long locationId) {
        return locationRepository.findById(locationId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid location ID" + locationId));
    }


    /**
     * 특정 창고가 가지고 있는 로케이션 전부 조회
     *
     * @param warehouseId: warehouse id
     * @return 입력 warehouseId를 가지고 있는 Location List
     */
    public List<Location> findAllByWarehouseId(Long warehouseId) {
        return locationRepository.findAllByWarehouseId(warehouseId);
    }

    public Location save(Location location) {
        return locationRepository.save(location);
    }

    public Location delete(Location location) {
        location.updateStatusEnum(StatusEnum.DELETED);
        return save(location);
    }


    /**
     * location 삭제 -> id로 location을 조회하고 해당 location의 상태값을 DELETED로 변경 location내부의 모든 층도 상태값을
     * DELETED로 변경
     *
     * @param id: locationId
     */
    public void delete(Long id) throws FloorException {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid location ID"));
        location.updateStatusEnum(StatusEnum.DELETED);

        List<Floor> floors = floorModuleService.findAllByLocationId(
            location.getId()); //location의 층 전부 조회
        for (Floor floor : floors) {
            floor.updateStatusEnum(StatusEnum.DELETED);
        }   //층들 전부 DELETED상태로 변경

        floorModuleService.saveAll(floors); //변경사항 저장
        locationRepository.save(location);
        //변경사항 저장
    }

    public boolean notExist(Long id) {
        return !locationRepository.existsById(id);
    }

}
