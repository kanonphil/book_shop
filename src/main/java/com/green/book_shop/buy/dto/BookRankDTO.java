package com.green.book_shop.buy.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRankDTO {
  private int bookNum;
  private String bookTitle;
  private String author;
  private int totalQty;
  private long totalSales;
}
