package com.a508.wms.location.domain;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLRestriction("status_enum = 'Active'")
@Table(name = "location")
public class Location extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStorageTypeEnum productStorageType;
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

    public Location(Warehouse warehouse, ProductStorageTypeEnum productStorageType,
                    int xPosition, int yPosition, int xSize, int ySize) {
        this.warehouse = warehouse;
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
    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
        warehouse.getLocations().add(this);
    }

}