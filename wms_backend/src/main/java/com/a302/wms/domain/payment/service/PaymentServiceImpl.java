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
import jakarta.transaction.Transactional;
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
   * TODO : JavaDoc 작성
   *
   * @param deviceId
   * @param dto
   * @return
   */
  @Transactional
  public PaymentResponseDto save(Long deviceId, PaymentCreateRequestDto dto) {
    log.info("[Service] save payment for device in store");

    Device device = deviceRepository.findById(deviceId).orElseThrow();

    Store store = storeRepository.findById(dto.storeId()).orElseThrow();

    Payment newPayemnt = paymentRepository.save(PaymentMapper.fromCreateRequestDto(dto, store));

    return PaymentMapper.toResponseDto(newPayemnt);
  }

  /**
   * TODO : JavaDoc 작성
   *
   * @param userId
   * @param paymentId
   * @return
   */
  public PaymentResponseDto findById(Long userId, Long paymentId) {
    log.info("[Service] find payment for user");

    User user = userRepository.findById(userId).orElseThrow();
    Payment payment = paymentRepository.findById(paymentId).orElseThrow();

    return PaymentMapper.toResponseDto(payment);
  }

  /**
   * TODO : JavaDoc 작성
   *
   * @param userId
   * @param paymentSearchRequestDto
   * @return
   */
  public List<PaymentResponseDto> find(
      Long userId, PaymentSearchRequestDto paymentSearchRequestDto) {
    log.info("[Service] find payment for user");

    User user = userRepository.findById(userId).orElseThrow();

    List<PaymentResponseDto> paymentList =
        paymentRepository
            .findPaymentsByStoreIdAndPaidAtBetween(
                paymentSearchRequestDto.storeId(),
                paymentSearchRequestDto.startDateTime(),
                paymentSearchRequestDto.endDateTime())
            .stream()
            .map(PaymentMapper::toResponseDto)
            .toList();

    return paymentList;
  }
}
