package com.a302.wms.domain.kiosk.entity;

import com.a302.wms.domain.store.entity.Store;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
@Table(name="kiosk")
public class Kiosk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false)
    private String kioskKey;


    @Builder
    public Kiosk(Store store, String kioskKey) {
        this.store = store;
        this.kioskKey = kioskKey;
    }
}
