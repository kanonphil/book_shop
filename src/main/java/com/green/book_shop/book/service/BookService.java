package com.green.book_shop.book.service;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
  private final BookMapper bookMapper;

  // 도서 등록
  public void regBook(BookDTO bookDTO) {
    bookMapper.insertBook(bookDTO);
  }
}
