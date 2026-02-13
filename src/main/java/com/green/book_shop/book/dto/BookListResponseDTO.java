package com.green.book_shop.book.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookListResponseDTO {
  private List<BookDTO> books;
  private int currentPage;
  private int totalPages;
  private long totalElements;
  private int size;
}
