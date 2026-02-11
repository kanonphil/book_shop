package com.green.book_shop.book.controller;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {
  private final BookService bookService;

  // 도서 등록
  @PostMapping("")
  public ResponseEntity<String> regBook(@RequestBody BookDTO bookDTO) {
    try {
      bookService.regBook(bookDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body("도서가 등록되었습니다.");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("도서 등록에 실패했습니다: " + e.getMessage());
    }
  }
}
