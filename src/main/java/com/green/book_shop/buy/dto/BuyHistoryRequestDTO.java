package com.green.book_shop.buy.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyHistoryRequestDTO {
  private String memEmail;
  private String startDate;
  private String endDate;
  private String bookTitle;
}
