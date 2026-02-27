package com.green.book_shop.book_cate.controller;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import com.green.book_shop.book_cate.service.BookCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
@Slf4j
public class BookCategoryController {
  private final BookCategoryService bookCategoryService;

  /**
   * 모든 카테고리 조회
   * GET /categories
   */
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

  /**
   * 카테고리 추가
   * POST /categories
   */
  @PostMapping("")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> addCategory(@RequestBody BookCategoryDTO bookCategoryDTO) {
    try {
      bookCategoryService.addCategory(bookCategoryDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
              "success", true,
              "message", "카테고리가 추가되었습니다."
      ));
    } catch (Exception e) {
      log.error("카테고리 추가 실패", e);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
              "success", false,
              "message", e.getMessage()
      ));
    }
  }

  /**
   * 카테고리 수정
   * PUT /categories/{cateNum}
   */
  @PutMapping("/{cateNum}")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> updateCategory(@PathVariable Integer cateNum,
                                          @RequestBody BookCategoryDTO bookCategoryDTO) {
    try {
      bookCategoryDTO.setCateNum(cateNum);
      bookCategoryService.updateCategory(bookCategoryDTO);
      return ResponseEntity.ok(Map.of(
              "success", true,
              "message", "카테고리가 수정되었습니다."
      ));
    } catch (Exception e) {
      log.error("카테고리 수정 실패", e);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
              "success", false,
              "message", e.getMessage()
      ));
    }
  }

  /**
   * 카테고리 삭제
   * DELETE /categories/{cateNum}
   */
  @DeleteMapping("/{cateNum}")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> deleteCategory(@PathVariable Integer cateNum) {
    try {
      bookCategoryService.deleteCategory(cateNum);
      return ResponseEntity.ok(Map.of(
              "success", true,
              "message", "카테고리가 삭제되었습니다."
      ));
    } catch (Exception e) {
      log.error("카테고리 삭제 실패", e);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
              "success", false,
              "message", e.getMessage()
      ));
    }
  }
}
