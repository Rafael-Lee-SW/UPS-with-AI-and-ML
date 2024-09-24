package com.a302.wms.domain.user.entity;

import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.domain.store.entity.Store;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(length = 20)
    private String name;

    @Column(length = 12)
    private String userNumber;

//    @OneToMany(mappedBy = "user")
//    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Store> stores = new ArrayList<>();

    @Builder
    public User(Long id, String name, List<Store> stores, User user, String userNumber) {
        this.id = id;
        this.name = name;
        this.stores = stores;
        this.userNumber = userNumber;
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateUserNumber(String userNumber) {
        this.userNumber = userNumber;
    }

//    public void setSubscriptions(List<Subscription> subscriptions) {
//        this.subscriptions = subscriptions;
//    }
    public void setStores(List<Store> stores) {
        this.stores = stores;
    }

}
