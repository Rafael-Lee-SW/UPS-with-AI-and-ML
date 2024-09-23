package com.a302.wms.store.entity;

import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@Getter
public class Wall extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false)
    private int startX;

    @Column(nullable = false)
    private int startY;

    @Column(nullable = false)
    private int endX;

    @Column(nullable = false)
    private int endY;

    @Builder
    public Wall(int endX, int endY, Long id, int startX, int startY, Store store) {
        this.endX = endX;
        this.endY = endY;
        this.id = id;
        this.startX = startX;
        this.startY = startY;
        this.store = store;
    }
}
