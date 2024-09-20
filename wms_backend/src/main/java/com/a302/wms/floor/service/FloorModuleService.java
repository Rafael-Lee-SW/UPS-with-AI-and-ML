package com.a302.wms.floor.service;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.floor.exception.FloorException;
import com.a302.wms.floor.repository.FloorRepository;
import com.a302.wms.location.entity.Location;
import com.a302.wms.location.dto.LocationRequestDto;
import com.a302.wms.product.entity.Product;
import com.a302.wms.product.repository.ProductRepository;
import com.a302.wms.util.constant.ExportTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.a302.wms.util.constant.ProductConstant.CONVERT_SIZE;
import static com.a302.wms.util.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

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
     * @param floorId: 층 productId
     * @return Floor
     */
    public Floor findById(Long floorId) throws FloorException {
        return floorRepository.findById(floorId).orElse(null);
    }


    /**
     * warehouse의 id와 floorLevel을 통해 default floor를 조회 (차후 수정 필요)
     *
     * @param storeId:warehouse의 productId
     * @param floorLevel:floor의      floorlevel
     * @return 해당 warehouse의 default Floor
     */
    public Floor findByStoreIdAndLevel(Long storeId, int floorLevel) {
        return floorRepository.findByStoreId(storeId, floorLevel);
    }

    public Floor findDefaultFloorByStore(Long storeId) {
        return findByStoreIdAndLevel(storeId, DEFAULT_FLOOR_LEVEL);
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
        for (int presentFloorLevel = 1; presentFloorLevel <= request.getZSize();
            presentFloorLevel++) {
            Floor floor = Floor.builder()
                .exportTypeEnum(
                    (presentFloorLevel <= request.getTouchableFloor()) ? ExportTypeEnum.DISPLAY
                        : ExportTypeEnum.KEEP)
                .floorLevel(presentFloorLevel)
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

    public List<Floor> findAllNotEmptyFloorByStoreId(Long id) {
        return floorRepository.findAllNotEmptyFloorByStoreId(id);
    }
}
