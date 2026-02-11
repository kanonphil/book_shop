package com.green.book_shop.book.dto;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BookDTO {
  private Integer bookNum;
  private String bookTitle;
  private String author;
  private Integer bookPrice;
  private Integer bookStock;
  private String bookIntro;
  private LocalDate publishDate;
  private Integer cateNum;

  // 조회 시 카테고리명도 함께 가져올 때 사용
  private String cateName;
}
