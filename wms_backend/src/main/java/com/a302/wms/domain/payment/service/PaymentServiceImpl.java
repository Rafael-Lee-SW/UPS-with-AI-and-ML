package com.a302.wms.domain.payment.service;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.payment.dto.OrderCreateRequest;
import com.a302.wms.domain.payment.dto.PaymentCreateRequest;
import com.a302.wms.domain.payment.dto.PaymentResponse;
import com.a302.wms.domain.payment.entity.Payment;
import com.a302.wms.domain.payment.mapper.PaymentMapper;
import com.a302.wms.domain.payment.repository.PaymentRepository;
import com.a302.wms.domain.product.entity.Product;
import com.a302.wms.domain.product.repository.ProductRepository;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.ResponseEnum;
import com.a302.wms.global.handler.CommonException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.a302.wms.global.constant.ResponseEnum.INVALID_PAYMENT;
import static com.a302.wms.global.constant.ResponseEnum.PAYMENT_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {

    private final PaymentRepository paymentRepository;
    private final DeviceRepository deviceRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * 해당 매장에 결제내역 새로 등록
     *
     * @param deviceId
     * @param dto
     * @return
     */
    @Transactional
    public List<PaymentResponse> save(Long deviceId, OrderCreateRequest orderCreateRequest) {
        log.info("[Service] save payment for device in store");

        Device device = deviceRepository.findById(deviceId).orElseThrow(() -> new CommonException(ResponseEnum.DEVICE_NOT_FOUND, "일치하는 디바이스를 찾을 수 없습니다."));

        // 판매 총액 확인
        Long sellingPriceSum = 0L;
        for (PaymentCreateRequest paymentCreateRequest : orderCreateRequest.paymentCreateRequestList()) {
            sellingPriceSum += paymentCreateRequest.sellingPrice() * paymentCreateRequest.quantity();
        }
        if (!sellingPriceSum.equals(orderCreateRequest.totalPrice()))
            throw new CommonException(INVALID_PAYMENT, "결제 총액과 각 상품의 구매액의 합이 다릅니다.");

        // 물건 수량 변경 및 Payment 생성 후 저장.
        List<Payment> newPaymentList = orderCreateRequest.paymentCreateRequestList().stream()
                .map(paymentCreateRequest -> {
                    Product product = productRepository.findByBarcodeAndStoreId(paymentCreateRequest.barcode(), device.getStore().getId());
                    product.updateQuantity(product.getQuantity() - paymentCreateRequest.quantity());

                    return Payment.builder()
                            .orderId(orderCreateRequest.orderId())
                            .store(device.getStore())
                            .barcode(paymentCreateRequest.barcode())
                            .quantity(paymentCreateRequest.quantity())
                            .sellingPrice(paymentCreateRequest.sellingPrice())
                            .build();
                })
                .toList();
        List<Payment> savedPayment = paymentRepository.saveAll(newPaymentList);
        return savedPayment.stream()
                .map(PaymentMapper::toResponseDto)
                .toList();
    }

    /**
     * 결제내역 id로 결제내역 상세 조회
     *
     * @param userId
     * @param paymentId
     * @return
     */
    public PaymentResponse findById(Long userId, Long paymentId) {
        log.info("[Service] find payment for user");

        User user = userRepository.findById(userId).orElseThrow(() -> new CommonException(ResponseEnum.USER_NOT_FOUND, "해당 유저가 없습니다."));
        Payment payment = paymentRepository.findById(paymentId).orElseThrow(() -> new CommonException(PAYMENT_NOT_FOUND, "해당 결제기록을 찾을 수 없습니다."));

        return PaymentMapper.toResponseDto(payment);
    }


    /**
     * orderId로 결제내역 조회
     *
     * @param userId
     * @param orderId
     * @return
     */
    public List<PaymentResponse> findByOrderId(Long userId, String orderId) {
        log.info("[Service] find payment for order");

        return paymentRepository.findPaymentsByOrderId(orderId).stream()
                .map(PaymentMapper::toResponseDto)
                .toList();
    }

    /**
     * storeId에 해당하는 store의 startDateTime에서 endDateTime 사이에 생성된 결제 내역 조회
     *
     * @param userId
     * @param storeId
     * @param start
     * @param end
     * @return
     */
    public List<PaymentResponse> find(
            Long userId, Long storeId, LocalDateTime start, LocalDateTime end) {
        log.info("[Service] find payment for user");

        User user = userRepository.findById(userId).orElseThrow();

        List<PaymentResponse> paymentList =
                paymentRepository
                        .findPaymentsByStoreIdAndPaidAtBetween(
                                storeId, start, end
                        )
                        .stream()
                        .map(PaymentMapper::toResponseDto)
                        .toList();

        return paymentList;
    }
}
