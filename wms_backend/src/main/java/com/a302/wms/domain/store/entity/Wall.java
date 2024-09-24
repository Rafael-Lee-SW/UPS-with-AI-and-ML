package com.a302.wms.domain.store.entity;

import com.a302.wms.domain.store.dto.wall.WallUpdateRequestDto;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@ToString
//@SQLRestriction("status_enum = 'Active'")
@RequiredArgsConstructor
//@AllArgsConstructor
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

//    @Enumerated(EnumType.STRING)
//    @Builder.Default
//    private StatusEnum statusEnum = StatusEnum.ACTIVE;
//
//    public void updateStatus(StatusEnum statusEnum) {
//        this.statusEnum = statusEnum;
//    }

    @Builder
    public Wall(Store store, int startX, int startY, int endX, int endY) {
        super();
        this.store = store;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    public void updateFromDto(WallUpdateRequestDto dto) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}
