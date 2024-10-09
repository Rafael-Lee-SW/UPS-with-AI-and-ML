package com.a302.wms.domain.floor.service;

import com.a302.wms.domain.floor.dto.FloorResponse;
import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.domain.floor.exception.FloorException;
import com.a302.wms.domain.floor.mapper.FloorMapper;
import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.structure.entity.Location;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.a302.wms.global.constant.ProductConstant.CONVERT_SIZE;
import static com.a302.wms.global.constant.ProductConstant.DEFAULT_FLOOR_LEVEL;

@Service
@Slf4j
@RequiredArgsConstructor
public class FloorServiceImpl {


    private final FloorRepository floorRepository;
    private final ProductRepository productRepository;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return Floor List
     */
    public List<FloorResponse> findAllByLocationId(Long locationId) {

        return floorRepository.findAllByLocationId(locationId)
                .stream().map(FloorMapper::toResponseDto)
                .toList();

    }

    /**
     * 층 단일 조회
     *
     * @param floorId: 층 productId
     * @return Floor
     */
    public FloorResponse findById(Long floorId) throws FloorException {
        return FloorMapper.toResponseDto(floorRepository.findById(floorId).get());
    }


    /**
     * warehouse의 id와 floorLevel을 통해 default floor를 조회 (차후 수정 필요)
     *
     * @param storeId:warehouse의 productId
     * @param floorLevel:floor의  floorlevel
     * @return 해당 warehouse의 default Floor
     */
    public Floor findByStoreIdAndLevel(Long storeId, int floorLevel) {
        return floorRepository.findByStoreIdAndLevel(storeId, floorLevel);
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
     * 해당 floor의 점유율을 반환하는 로직
     *
     * @param floor
     * @return
     */
    public int getCapacity(Floor floor) {
        List<Product> products = productRepository.findAllByFloor(floor);

        int floorSize = calculateFloorSize(floor);

        int productTotalSize = products.stream()
                .mapToInt(Product::getQuantity)
                .sum();

        return Math.min(100, productTotalSize * 100 / floorSize);
    }

    /**
     * floorSize 계산 메서드
     *
     * @param floor
     * @return
     */
    private int calculateFloorSize(Floor floor) {
        int xSize = floor.getLocation().getXSize();
        int ySize = floor.getLocation().getYSize();

        return xSize * CONVERT_SIZE * ySize * CONVERT_SIZE;
    }

    /**
     * floorList로 주어진 floor 모두 삭제
     *
     * @param floorList
     */
    public void deleteAll(List<Floor> floorList) {
        floorRepository.deleteAll(floorList);
    }

    public Floor saveDefaultFloor(Location location) {
        return floorRepository.save(Floor.builder()
                .floorLevel(-1)
                .location(location)
                .build());
    }

    public Floor saveOtherFloor(Location location, Integer floorLevel) {
        return floorRepository.save(Floor.builder()
                .floorLevel(floorLevel)
                .location(location)
                .build());
    }

}
