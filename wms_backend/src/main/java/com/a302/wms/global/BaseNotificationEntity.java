package com.a302.wms.global;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
@RequiredArgsConstructor
public class BaseNotificationEntity extends BaseTimeEntity {

    @Column(name="is_read", nullable = false)
    private Boolean isRead;

    @Column(name="is_important", nullable = false)
    private Boolean isImportant;

    @Column(name="message", nullable = false)
    private String message;


    public BaseNotificationEntity(Boolean isRead, Boolean isImportant, String message) {
       this.isRead = isRead;
       this.isImportant = isImportant;
       this.message = message;
    }
}
