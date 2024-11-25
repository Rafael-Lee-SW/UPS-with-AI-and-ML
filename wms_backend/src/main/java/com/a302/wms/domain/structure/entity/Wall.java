package com.a302.wms.domain.structure.entity;

import com.a302.wms.domain.store.entity.Store;
import com.a302.wms.domain.structure.dto.wall.WallUpdateRequest;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@RequiredArgsConstructor
public class Wall extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
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
    public Wall(Store store, int startX, int startY, int endX, int endY) {
        super();
        this.store = store;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    public void updateFromDto(WallUpdateRequest dto) {
        this.startX = dto.startX();
        this.startY = dto.startY();
        this.endX = dto.endX();
        this.endY = dto.endY();
    }

}
