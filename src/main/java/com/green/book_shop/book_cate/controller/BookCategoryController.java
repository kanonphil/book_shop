package com.green.book_shop.book_cate.controller;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import com.green.book_shop.book_cate.service.BookCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class BookCategoryController {
  private final BookCategoryService bookCategoryService;

  // 모든 카테고리 조회
  @GetMapping("")
  public ResponseEntity<?> getAllCategories() {
    try {
      List<BookCategoryDTO> categories = bookCategoryService.getAllCategories();
      return ResponseEntity.ok(categories);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("카테고리 조회에 실패했습니다: " + e.getMessage());
    }
  }
}
