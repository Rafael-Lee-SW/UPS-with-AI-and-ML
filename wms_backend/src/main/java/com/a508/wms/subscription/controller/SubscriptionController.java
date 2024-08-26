package com.a508.wms.subscription.controller;

import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.subscription.service.SubscriptionService;
import com.a508.wms.util.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * 전체 구독 혹은 특정 사업체의 전체 구독을 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 구독을 조회하는 경우 사업체 고유 번호 입력
     * @return List<SubscriptionDto> (전체 구독),
     * List<SubscriptionDto> (특정 사업체의 전체 구독)
     */
    @GetMapping
    public BaseSuccessResponse<?> getSubscriptions(@RequestParam(required = false) Long businessId) {
        if (businessId == null) {
            return new BaseSuccessResponse<>(subscriptionService.findAll());
        } else {
            return new BaseSuccessResponse<>(subscriptionService.findsByBusinessId(businessId));
        }
    }
    /**
     * 구독 정보를 등록하는 메서드
     *
     * @param subscriptionDto : 등록할 정보
     * @return SubscriptionDto
     */
    @PostMapping
    public BaseSuccessResponse<?>  createSubscription(@RequestBody SubscriptionDto subscriptionDto) {
        return new BaseSuccessResponse<>(subscriptionService.save(subscriptionDto));
    }

    /**
     * 구독 정보를 수정하는 메서드
     *
     * @param id              : 구독 고유 번호
     * @param subscriptionDto : 수정할 정보
     * @return SubscriptionDto
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?>  updateSubscription(@PathVariable Long id, @RequestBody SubscriptionDto subscriptionDto) {
        return new BaseSuccessResponse<>(subscriptionService.update(id, subscriptionDto));
    }

    /**
     * 구독 정보를 삭제하는 메서드
     *
     * @param id : 구독 고유 번호
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.delete(id);
        return new BaseSuccessResponse<>(null);
    }
}
