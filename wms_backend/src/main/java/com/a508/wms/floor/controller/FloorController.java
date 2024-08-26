package com.a508.wms.floor.controller;

import com.a508.wms.floor.dto.FloorResponseDto;
import com.a508.wms.floor.exception.FloorException;
import com.a508.wms.floor.service.FloorService;
import com.a508.wms.util.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/floors")
public class FloorController {

    private final FloorService floorService;

    /**
     * LocationId를 통해 해당 로케이션이 보유한 층 전부 조회
     *
     * @param locationId:location 아이디
     * @return FloorDto List
     */
    @GetMapping
    public BaseSuccessResponse<List<FloorResponseDto>> findAllByLocationId(
        @RequestParam(name = "locationId") Long locationId) throws FloorException {
        log.info("[Controller] find all Floors by locationId: {}", locationId);
        return new BaseSuccessResponse<>(floorService.findAllByLocationId(locationId));
    }

    /**
     * floor의 Id를 통해 해당 floor를 조회
     *
     * @param id:floor 아이디
     * @return FloorDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<FloorResponseDto> findById(@PathVariable Long id) throws FloorException {
        log.info("[Controller] find Floor by id: {}", id);
        return new BaseSuccessResponse<>(floorService.findById(id));
    }
}
