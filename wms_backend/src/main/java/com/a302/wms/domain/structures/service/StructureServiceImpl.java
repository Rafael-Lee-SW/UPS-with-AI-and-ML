package com.a302.wms.domain.structures.service;

import com.a302.wms.domain.floor.repository.FloorRepository;
import com.a302.wms.domain.structure.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StructureServiceImpl {

    private final FloorRepository floorRepository;
    private final LocationRepository locationRepository;


}
