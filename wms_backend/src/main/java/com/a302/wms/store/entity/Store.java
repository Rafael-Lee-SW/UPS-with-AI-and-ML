package com.a302.wms.store.entity;

import com.a302.wms.user.entity.User;
import com.a302.wms.location.entity.Location;
import com.a302.wms.util.BaseTimeEntity;
import com.a302.wms.util.constant.FacilityTypeEnum;
import com.a302.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter

@Table(name = "store")
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Store extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;

    @OneToMany(mappedBy = "store")
    private List<Location> locations = new ArrayList<>();

    @OneToMany(mappedBy = "store")
    private List<Wall> walls = new ArrayList<>();

    @Column(nullable = false)
    private int size;

    @Column(length = 20)
    private String name;

    @Column(nullable = false)
    private int rowCount;

    @Column(nullable = false)
    private int columnCount;

    @Column(nullable = false, columnDefinition = "integer default 1")
    private int priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityTypeEnum facilityTypeEnum;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    // 연관관계 편의를 위한 메서드
    public void setUser(User user) {
        this.user = user;
        user.getStores().add(this);
    }

}
