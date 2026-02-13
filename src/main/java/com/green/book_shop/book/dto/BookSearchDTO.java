package com.green.book_shop.book.dto;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BookSearchDTO {
  private String keyword;
  private Integer cateNum;
  private int offset;
  private int size;
}