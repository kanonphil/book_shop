package com.green.book_shop.book.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {
  private Integer bookNum;
  private String bookTitle;
  private String author;
  private Integer bookPrice;
  private Integer bookStock;
}
