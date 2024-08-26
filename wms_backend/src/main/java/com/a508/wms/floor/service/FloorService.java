package com.a508.wms.floor.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorResponseDto;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.mapper.FloorMapper;
import java.util.List;
import java.util.stream.Collectors;

import com.a508.wms.floor.repository.FloorRepository;
import com.a508.wms.product.dto.ProductCompressDtoInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
     * @param id: 층 id
     * @return FloorDto
     */
    public FloorResponseDto findById(Long id) throws FloorException {
        log.info("[Service] find Floor by id: {}", id);
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


    public List<Floor> findAllEmptyFloorByWarehouseId(Long warehouseId) {
        log.info("[Service] findAllEmptyFloorByWarehouseId: {}", warehouseId);
        return floorRepository.findAllEmptyFloorByWarehouseId(warehouseId);
    }
    public List<ProductCompressDtoInterface> findAllDisplayFloorByWarehouseId(Long warehouseId) {
        log.info("[Service] findAllDisplayFloorByWarehouseId: {}", warehouseId);
        return floorRepository.findAllDisplayFloorByWarehouseId(warehouseId);
    }
    public List<Floor> findAllEmptyKeepFloorByWarehouseId(Long warehouseId) {
        log.info("[Service] findAllEmptyKeepFloorByWarehouseId: {}", warehouseId);
        return floorRepository.findAllEmptyKeepFloorByWarehouseId(warehouseId);
    }
}
