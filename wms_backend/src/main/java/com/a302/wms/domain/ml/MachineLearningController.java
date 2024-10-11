package com.a302.wms.domain.ml;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ml")
@RequiredArgsConstructor
@Slf4j
public class MachineLearningController {

    @GetMapping("/health")
    public String health() {
        return "Hello";
    }
}
