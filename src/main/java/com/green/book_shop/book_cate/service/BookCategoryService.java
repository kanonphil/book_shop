package com.green.book_shop.book_cate.service;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import com.green.book_shop.book_cate.mapper.BookCategoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookCategoryService {
  private final BookCategoryMapper bookCategoryMapper;

  // 모든 카테고리 조회
  public List<BookCategoryDTO> getAllCategories() {
    return bookCategoryMapper.selectAllCategories();
  }

  // 카테고리 추가
  public void addCategory(BookCategoryDTO bookCategoryDTO) {
    int result = bookCategoryMapper.insertCategory(bookCategoryDTO);
    if (result == 0) {
      throw new RuntimeException("카테고리 추가에 실패했습니다.");
    }
    log.info("카테고리 추가 완료 - cateName: {}", bookCategoryDTO.getCateName());
  }

  // 카테고리 수정
  public void updateCategory(BookCategoryDTO bookCategoryDTO) {
    int result = bookCategoryMapper.updateCategory(bookCategoryDTO);
    if (result == 0) {
      throw new RuntimeException("카테고리를 찾을 수 없습니다. CATE_NUM: " + bookCategoryDTO.getCateNum());
    }
    log.info("카테고리 수정 완료 - cateNum: {}, cateName: {}", bookCategoryDTO.getCateNum(), bookCategoryDTO.getCateName());
  }

  // 카테고리 삭제
  public void deleteCategory(Integer cateNum) {
    // 해당 카테고리에 도서 존재 여부 확인
    int bookCount = bookCategoryMapper.selectBookCountByCateNum(cateNum);
    if (bookCount > 0) {
      throw new RuntimeException("해당 카테고리에 속한 도서가 " + bookCount + "권 있어 삭제할 수 없습니다.");
    }

    int result = bookCategoryMapper.deleteCategory(cateNum);
    if (result == 0) {
      throw new RuntimeException("카테고리를 찾을 수 없습니다. CATE_NUM: " + cateNum);
    }
    log.info("카테고리 삭제 완료 - cateNum: {}", cateNum);
  }
}
