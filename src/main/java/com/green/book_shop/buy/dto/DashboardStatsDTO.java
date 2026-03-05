package com.green.book_shop.buy.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
  private int todayOrderCount;
  private int monthOrderCount;
  private long todaySales;
  private long monthSales;
}
