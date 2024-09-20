package com.a302.wms.floor.service;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.dto.FloorResponseDto;
import com.a302.wms.floor.exception.FloorException;
import com.a302.wms.floor.mapper.FloorMapper;
import com.a302.wms.floor.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FloorService {

    private final FloorModuleService floorModuleService;
    private final FloorRepository floorRepository;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return FloorDto List
     */
    public List<FloorResponseDto> findAllByLocationId(Long locationId) throws FloorException {
        log.info("[Service] find all Floors by locationId: {}", locationId);
        List<Floor> floors = floorModuleService.findAllByLocationId(locationId);
        return floors.stream()
            .map(FloorMapper::toFloorResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * 층 단일 조회
     *
     * @param id: 층 productId
     * @return FloorDto
     */
    public FloorResponseDto findById(@PathVariable Long id) throws FloorException {
        log.info("[Service] find Floor by productId: {}", id);
        try {
            Floor floor = floorModuleService.findById(id);
            return FloorMapper.toFloorResponseDto(floor);
        } catch (FloorException.DeletedException e) {
            throw new FloorException.DeletedException(id);
        } catch (NullPointerException e) {
            throw new FloorException.NotFoundException(id);
        } catch (FloorException.NotFoundDefaultFloorException e) {
            throw new FloorException.NotFoundDefaultFloorException(id);
        } catch (FloorException.InvalidExportType e) {
            throw new FloorException.InvalidExportType(id);
        }
    }


    public List<Floor> findAllEmptyFloorByStoreId(Long storeId) {
        log.info("[Service] findAllEmptyLocationByStoreId: {}", storeId);
        return floorRepository.findAllEmptyFloorByStoreId(storeId);
    }
}
