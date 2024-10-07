package com.a302.wms.domain.store.entity;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.store.dto.StoreUpdateRequest;
import com.a302.wms.domain.structure.entity.Location;
import com.a302.wms.domain.structure.entity.Wall;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "store")
@RequiredArgsConstructor
@ToString
public class Store extends BaseTimeEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Location> locations = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Wall> walls = new ArrayList<>();

    @Column(nullable = false)
    private int size;

    @Column(length = 20)
    private String storeName;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Device> devices = new ArrayList<>();

    @Builder
    public Store(User user, int size, String storeName) {
        super();
        this.user = user;
        this.size = size;
        this.storeName = storeName;
    }


    public void update(StoreUpdateRequest storeUpdateRequest) {
        this.size = storeUpdateRequest.size();
        this.storeName = storeUpdateRequest.storeName();
    }
}
