package com.green.book_shop.book_cate.controller;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import com.green.book_shop.book_cate.service.BookCategoryService;
import lombok.RequiredArgsConstructor;
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
  public List<BookCategoryDTO> getAllCategories() {
    return bookCategoryService.getAllCategories();
  }
}
