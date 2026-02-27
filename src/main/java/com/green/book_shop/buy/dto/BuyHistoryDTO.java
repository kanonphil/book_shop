package com.green.book_shop.buy.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyHistoryDTO {
  private int buyNum;
  private String memEmail;
  private int buyPrice;
  private LocalDateTime buyDate;
  private List<BuyDetailDTO> details;
}
