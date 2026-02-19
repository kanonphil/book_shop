package com.green.book_shop.book.dto;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BookImgDTO {
  private Integer imgNum;
  private String originFileName;
  private String uploadFileName;
  private String isMain;
  private Integer bookNum;
}
