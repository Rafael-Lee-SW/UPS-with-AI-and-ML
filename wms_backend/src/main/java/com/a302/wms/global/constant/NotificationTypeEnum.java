package com.a302.wms.global.constant;

import java.util.Arrays;
import lombok.Getter;

@Getter
public enum NotificationTypeEnum {
  FLOW("이동"),
  IMPORT("입고"),
  MODIFY("수정"),
  CRIME_PREVENTION("방범"),
  PAYMENT("결제");

  private final String value;

  NotificationTypeEnum(String value) {
    this.value = value;
  }

  public static boolean isExist(String value) {
    return Arrays.stream(NotificationTypeEnum.values())
        .anyMatch(type -> type.name().equalsIgnoreCase(value));
  }


}
