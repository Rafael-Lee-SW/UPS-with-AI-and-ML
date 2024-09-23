package com.a302.wms.domain.location.entity;

import com.a302.wms.domain.floor.entity.Floor;
import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.domain.store.entity.Store;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "location")
public class Location extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
    @Column(nullable = false, length = 10)
    private String name;
    @Column(nullable = false)
    private int xPosition = -1;
    @Column(nullable = false)
    private int yPosition = -1;
    @Column(nullable = false)
    private int rotation = 0;
    @Column(nullable = false)
    private int xSize = -1;
    @Column(nullable = false)
    private int ySize = -1;
    @Column(nullable = false)
    private int zSize = -1;
    @OneToMany(mappedBy = "location")
    private List<Floor> floors = new ArrayList<>();

    @Builder
    public Location(List<Floor> floors, Long id, String name, int rotation, Store store, int xPosition, int xSize, int yPosition, int ySize, int zSize) {
        this.floors = floors;
        this.id = id;
        this.name = name;
        this.rotation = rotation;
        this.store = store;
        this.xPosition = xPosition;
        this.xSize = xSize;
        this.yPosition = yPosition;
        this.ySize = ySize;
        this.zSize = zSize;
    }

    public void updatePosition(int xPosition, int yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    public void updateFloors(List<Floor> floors) {
        this.floors = floors;
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