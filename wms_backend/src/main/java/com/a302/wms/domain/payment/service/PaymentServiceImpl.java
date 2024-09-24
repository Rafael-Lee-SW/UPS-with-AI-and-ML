package com.a302.wms.domain.payment.service;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.device.repository.DeviceRepository;
import com.a302.wms.domain.payment.dto.PaymentCreateRequestDto;
import com.a302.wms.domain.payment.dto.PaymentResponseDto;
import com.a302.wms.domain.payment.dto.PaymentSearchRequestDto;
import com.a302.wms.domain.payment.entity.Payment;
import com.a302.wms.domain.payment.mapper.PaymentMapper;
import com.a302.wms.domain.payment.repository.PaymentRepository;
import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.store.repository.StoreRepository;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.domain.user.repository.UserRepository;
import com.a302.wms.global.constant.DeviceTypeEnum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {

    private final PaymentRepository paymentRepository;
    private final DeviceRepository deviceRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;


    @Transactional
    public PaymentResponseDto save(Long deviceId, PaymentCreateRequestDto dto) {
        log.info("[Service] save payment for device {} in store {}", deviceId, dto.storeId());

        Device device = deviceRepository.findById(deviceId).orElseThrow();
//        if(device.getDeviceType()!= DeviceTypeEnum.KIOSK() throw new Exception();

        Store store = storeRepository.findById(dto.storeId()).orElseThrow();

        Payment newPayemnt = paymentRepository.save(PaymentMapper.fromCreateRequestDto(dto, store));

        return PaymentMapper.toResponseDto(newPayemnt);
    }

    public PaymentResponseDto findById(Long userId, Long paymentId) {
        log.info("[Service] find payment for user {} payment {}", userId, paymentId);

        User user = userRepository.findById(userId).orElseThrow();
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();
//        if(payment.getStore().getUser().getId()!=userId) throw new

        return PaymentMapper.toResponseDto(payment);
    }


    public List<PaymentResponseDto> find(Long userId, PaymentSearchRequestDto dto) {
        log.info("[Service] find payment for user {} payment {}", userId, dto);

        User user = userRepository.findById(userId).orElseThrow();
//        if(payment.getStore().getUser().getId()!=userId) throw new

        List<PaymentResponseDto> paymentList = paymentRepository.findPaymentsByStoreIdAndPaidAtBetween(dto.storeId(), dto.startDateTime(), dto.endDateTime())
                .stream()
                .map(PaymentMapper::toResponseDto)
                .toList();

        return paymentList;
    }
}
