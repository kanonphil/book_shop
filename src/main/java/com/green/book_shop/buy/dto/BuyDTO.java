package com.green.book_shop.buy.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyDTO {
  private int buyNum;
  private int buyPrice;
  private String memEmail;
  private LocalDateTime buyDate;
  // 상세 목록
  private List<BuyDetailDTO> details;
}
