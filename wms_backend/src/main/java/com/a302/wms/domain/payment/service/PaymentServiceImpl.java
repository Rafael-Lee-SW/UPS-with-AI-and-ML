package com.a302.wms.domain.payment.service;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.payment.dto.PaymentCreateRequest;
import com.a302.wms.domain.payment.dto.PaymentResponse;
import com.a302.wms.domain.payment.dto.PaymentSearchRequest;
import com.a302.wms.domain.payment.entity.Payment;
import com.a302.wms.domain.payment.mapper.PaymentMapper;
import com.a302.wms.domain.payment.repository.PaymentRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {

    private final PaymentRepository paymentRepository;
    private final DeviceRepository deviceRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    /**
     * 해당 매장에 결제내역 새로 등록
     *
     * @param deviceId
     * @param dto
     * @return
     */
    @Transactional
    public PaymentResponse save(Long deviceId, PaymentCreateRequest dto) {
        log.info("[Service] save payment for device in store");

        Device device = deviceRepository.findById(deviceId).orElseThrow();

        Store store = storeRepository.findById(dto.storeId()).orElseThrow();

        Payment newPayemnt = paymentRepository.save(PaymentMapper.fromCreateRequestDto(dto, store));

        return PaymentMapper.toResponseDto(newPayemnt);
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

        User user = userRepository.findById(userId).orElseThrow();
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();

        return PaymentMapper.toResponseDto(payment);
    }

    /**
     * storeId에 해당하는 store의 startDateTime에서 endDateTime 사이에 생성된 결제 내역 조회
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
