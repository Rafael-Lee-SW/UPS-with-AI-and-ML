package com.a508.wms.floor.domain;

import com.a508.wms.location.domain.Location;
import com.a508.wms.product.domain.Product;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@SQLRestriction("status_enum = 'Active'")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "floor")
@ToString
public class Floor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int floorLevel;

    @Column(nullable = false)
    private ExportTypeEnum exportTypeEnum;

    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToMany(mappedBy = "floor")
    @Builder.Default
    private List<Product> Products = new ArrayList<>();

    public void updateStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    //삭제 처리
    public void delete() {
        this.statusEnum = StatusEnum.DELETED;
    }

    //연관관계 편의 메서드
    public Floor setLocation(Location location) {
        this.location = location;
        if (!location.getFloors().contains(this)) {
            location.getFloors().add(this);
        }
        return this;
    }
}
