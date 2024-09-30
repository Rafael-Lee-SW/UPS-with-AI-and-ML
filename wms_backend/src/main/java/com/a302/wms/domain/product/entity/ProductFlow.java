package com.a302.wms.domain.product.entity;

import com.a302.wms.global.BaseTimeEntity;
import com.a302.wms.global.constant.ProductFlowTypeEnum;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

@Table(name = "product_flow")
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductFlow extends BaseTimeEntity {

  @Id
  @Column(name = "id", nullable = false)
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long productFlowId;

  @Column(name = "product_name", nullable = false)
  private String productName;

  @Column(name = "barcode", nullable = false)
  private Long barcode;

  @Column(name = "sku", nullable = false)
  private String sku;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @DateTimeFormat(pattern = "yyyy-MM-dd")
  @Column(name = "flow_date", nullable = false)
  private LocalDateTime flowDate;

  @Column(name = "present_floor_id", nullable = false)
  private Long presentFloorId;

  @Column(name = "previous_floor_id")
  private Long previousFloorId;

  @Column(name = "product_flow_type", nullable = false)
  @Enumerated(EnumType.STRING)
  private ProductFlowTypeEnum productFlowTypeEnum;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Builder
  public ProductFlow(
      Long barcode,
      LocalDateTime flowDate,
      Long presentFloorId,
      Long previousFloorId,
      ProductFlowTypeEnum productFlowTypeEnum,
      String productName,
      Integer quantity,
      String sku,
      Long userId) {
    this.barcode = barcode;
    this.flowDate = flowDate;
    this.presentFloorId = presentFloorId;
    this.previousFloorId = previousFloorId;
    this.productFlowTypeEnum = productFlowTypeEnum;
    this.productName = productName;
    this.quantity = quantity;
    this.sku = sku;
    this.userId = userId;
  }
}
