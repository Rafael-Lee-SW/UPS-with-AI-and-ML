package com.a508.wms.floor.service;

import static com.a508.wms.util.constant.ProductConstant.CONVERT_SIZE;
import static com.a508.wms.util.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.repository.FloorRepository;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationRequestDto;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.repository.ProductRepository;
import com.a508.wms.util.constant.ExportTypeEnum;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FloorModuleService {


    private final FloorRepository floorRepository;
    private final ProductRepository productRepository;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return Floor List
     */
    public List<Floor> findAllByLocationId(Long locationId) {

        return floorRepository.findAllByLocationId(locationId);
    }

    /**
     * 층 단일 조회
     *
     * @param floorId: 층 id
     * @return Floor
     */
    public Floor findById(Long floorId) throws FloorException {
        return floorRepository.findById(floorId).orElse(null);
    }


    /**
     * warehouse의 id와 floorLevel을 통해 default floor를 조회 (차후 수정 필요)
     *
     * @param warehouseId:warehouse의 id
     * @param floorLevel:floor의      floorlevel
     * @return 해당 warehouse의 default Floor
     */
    public Floor findByWarehouseIdAndLevel(Long warehouseId, int floorLevel) {
        return floorRepository.findByWarehouseId(warehouseId, floorLevel);
    }

    public Floor findDefaultFloorByWarehouse(Long warehouseId) {
        return findByWarehouseIdAndLevel(warehouseId, DEFAULT_FLOOR_LEVEL);
    }

    /**
     * floor list를 저장
     *
     * @param floors:저장할 floor list
     * @return id가 포함된 저장된 floor list
     */
    public List<Floor> saveAll(List<Floor> floors) {
        return floorRepository.saveAll(floors);
    }

    /**
     * floor를 저장
     *
     * @param floor:저장할 floor
     * @return id가 포함된 저장된 floor
     */
    public Floor save(Floor floor) {
        return floorRepository.save(floor);
    }

    /**
     * 매핑할 request의 zSize만큼 floor를 만들어서 각 floor를 location에 매핑한다..
     *
     * @param request
     * @param location
     */
    public void saveAllByLocation(LocationRequestDto request, Location location) {
        List<Floor> floors = new ArrayList<>();
        for (int currentFloorLevel = 1; currentFloorLevel <= request.getZSize();
            currentFloorLevel++) {
            Floor floor = Floor.builder()
                .exportTypeEnum(
                    (currentFloorLevel <= request.getTouchableFloor()) ? ExportTypeEnum.DISPLAY
                        : ExportTypeEnum.KEEP)
                .floorLevel(currentFloorLevel)
                .location(location)
                .build();
            floors.add(floor);
        }
        saveAll(floors);
        location.setFloors(floors);
    }

    /**
     * 해당 floor의 점유율을 반환하는 로직
     *
     * @param floor
     * @return
     */

    public int getCapacity(Floor floor) {
        List<Product> products = productRepository.findByFloor(floor);

        int floorSize = calculateFloorSize(floor);

        int productTotalSize = products.stream()
            .mapToInt(Product::getQuantity)
            .sum();

        return Math.min(100, productTotalSize * 100 / floorSize);
    }

    private int calculateFloorSize(Floor floor) {
        int xSize = floor.getLocation().getXSize();
        int ySize = floor.getLocation().getYSize();

        return xSize * CONVERT_SIZE * ySize * CONVERT_SIZE;
    }

    public List<Floor> findAllNotEmptyFloorByWarehouseId(Long id) {
        return floorRepository.findAllNotEmptyFloorByWarehouseId(id);
    }
}
