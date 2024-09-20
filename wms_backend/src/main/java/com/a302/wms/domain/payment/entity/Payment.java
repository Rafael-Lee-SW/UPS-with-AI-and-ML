package com.a302.wms.domain.payment.entity;

import com.a302.wms.domain.store.entity.Store;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "paid_amount", nullable = false)
    private Long paidAmount;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt;

    @Builder
    public Payment(Store store, Long paidAmount, Long totalAmount, LocalDateTime paidAt) {
        this.store = store;
        this.paidAmount = paidAmount;
        this.totalAmount = totalAmount;
        this.paidAt = paidAt;
    }
}
