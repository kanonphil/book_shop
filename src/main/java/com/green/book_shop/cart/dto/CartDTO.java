package com.green.book_shop.cart.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
  private Integer cartNum;
  private Integer bookNum;
  private Integer cartCnt;
  private String memEmail;
  private LocalDateTime cartDate;

  // Join Field
  private String bookTitle;
  private String author;
  private Integer bookPrice;
  private Integer bookStock;
  private String bookImage;
}
