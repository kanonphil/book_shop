package com.green.book_shop.buy.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesDTO {
  private String label;
  private Integer totalSales;
  private Integer orderCount;
}
