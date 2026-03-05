package com.green.book_shop.buy.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyRankDTO {
  private int rank;
  private String memEmail;
  private long totalSales;
  private int orderCount;
}
