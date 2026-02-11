package com.green.book_shop.book_cate.service;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import com.green.book_shop.book_cate.mapper.BookCategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookCategoryService {
  private final BookCategoryMapper bookCategoryMapper;

  // 모든 카테고리 조회
  public List<BookCategoryDTO> getAllCategories() {
    return bookCategoryMapper.selectAllCategories();
  }
}
