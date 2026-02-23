package com.green.book_shop.buy.dto;

import lombok.*;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyDetailDTO {
  private int buyDetailNum;
  private int bookNum;
  private int buyCnt;
  private int buyPrice;
  private int buyNum;
  // 도서 정보
  private String bookTitle;
  private String uploadFileName;
  private Integer bookPrice;
}
