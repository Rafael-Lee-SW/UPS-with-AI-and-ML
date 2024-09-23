package com.a302.wms.domain.store.entity;

import com.a302.wms.domain.device.entity.Device;
import com.a302.wms.domain.user.entity.User;
import com.a302.wms.global.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Table(name="store")
@RequiredArgsConstructor
public class Store extends BaseTimeEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne
    private User user;
//
//    @OneToMany(mappedBy = "store")
//    private List<Location> locations = new ArrayList<>();
//
//    @OneToMany(mappedBy = "store")
//    private List<Wall> walls = new ArrayList<>();

    @Column(nullable = false)
    private int size;

    @Column(length = 20)
    private String storeName;

    @OneToMany(mappedBy = "store")
    List<Device> devices;

    // 연관관계 편의를 위한 메서드
//    public void setBusiness(User user) {
//        this.user = user;
//        user.getStores().add(this);
//    }


    @Builder
    public Store(User user, int size, String storeName, LocalDateTime createdDate, LocalDateTime updatedDate) {
        super();
        this.user = user;
        this.size = size;
        this.storeName = storeName;
    }
}
