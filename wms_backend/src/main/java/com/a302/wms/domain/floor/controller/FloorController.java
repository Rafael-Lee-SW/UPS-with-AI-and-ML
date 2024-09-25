package com.a302.wms.domain.floor.controller;

import com.a302.wms.domain.floor.dto.FloorResponse;
import com.a302.wms.domain.floor.exception.FloorException;
import com.a302.wms.domain.floor.service.FloorServiceImpl;
import com.a302.wms.global.response.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/floors")
public class FloorController {

    private final FloorServiceImpl floorServiceImpl;

    /**
     * LocationId를 통해 해당 로케이션이 보유한 층 전부 조회
     *
     * @param locationId:location 아이디
     * @return FloorDto List
     */
    @GetMapping
    public BaseSuccessResponse<List<FloorResponse>> findAllByLocationId(
        @RequestParam(name = "locationId") Long locationId) throws FloorException {
        log.info("[Controller] find all Floors by locationId");
        return new BaseSuccessResponse<>(floorServiceImpl.findAllByLocationId(locationId));
    }

    /**
     * floor의 Id를 통해 해당 floor를 조회
     *
     * @param id:floor 아이디
     * @return FloorDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<FloorResponse> findById(@PathVariable Long id) throws FloorException {
        log.info("[Controller] find Floor by productId");
        return new BaseSuccessResponse<>(floorServiceImpl.findById(id));
    }
}
