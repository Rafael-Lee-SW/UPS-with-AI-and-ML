package com.a302.wms.location.entity;

import com.a302.wms.floor.entity.Floor;
import com.a302.wms.util.BaseTimeEntity;
import com.a302.wms.util.constant.StatusEnum;
import com.a302.wms.store.entity.Store;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder

@Table(name = "location")
public class Location extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Store store;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private  productStorageType;
    @Column(nullable = false, length = 10)
    @Builder.Default
    private String name = "00-00";
    @Column(nullable = false)
    @Builder.Default
    private int xPosition = -1;
    @Column(nullable = false)
    @Builder.Default
    private int yPosition = -1;
    @Column(nullable = false)
    @Builder.Default
    private int rotation = 0;
    @Column(nullable = false)
    @Builder.Default
    private int xSize = -1;
    @Column(nullable = false)
    @Builder.Default
    private int ySize = -1;
    @Column(nullable = false)
    @Builder.Default
    private int zSize = -1;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;
    @Setter
    @OneToMany(mappedBy = "location")
    @Builder.Default
    private List<Floor> floors = new ArrayList<>();

    public Location(Store store,  productStorageType,
                    int xPosition, int yPosition, int xSize, int ySize) {
        this.store = store;
        this.productStorageType = productStorageType;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.xSize = xSize;
        this.ySize = ySize;
    }

    //상태값 변경 메서드 -> 삭제에 사용
    public void updateStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void updatePosition(int xPosition, int yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    public void updateName(String name) {
        this.name = name;
    }

    // 연관관계 편의 메서드
    public void setStore(Store store) {
        this.store = store;
        store.getLocations().add(this);
    }

}