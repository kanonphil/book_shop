package com.green.book_shop.buy.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BuyRequestDTO {
  private int buyPrice;
  private List<BuyDetailDTO> details;

  @Setter
  @Getter
  public static class BuyDetailDTO {
    private int bookNum;
    private int buyCnt;
    private int buyPrice;
  }
}
