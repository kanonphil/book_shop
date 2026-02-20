package com.green.book_shop.book.controller;

import com.green.book_shop.book.service.BookImgService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/books/{bookNum}/images")
public class BookImgController {
  private final BookImgService bookImgService;

  /**
   * 도서 이미지 추가 (관리자/매니저만)
   * POST /books/{bookNum}/images
   */
  @PostMapping("")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> addImgs(
          @PathVariable int bookNum,
          @RequestPart(value = "mainImg", required = false)MultipartFile mainImg,
          @RequestPart(value = "subImgs", required = false)List<MultipartFile> subImgs) {
    try {
      log.info("도서 이미지 추가 요청 - bookNum: {}", bookNum);
      bookImgService.saveImgs(bookNum, mainImg, subImgs);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "이미지가 추가되었습니다.");
      return ResponseEntity.status(HttpStatus.CREATED).body(result);
    } catch (Exception e) {
      log.error("도서 이미지 추가 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "이미지 추가에 실패했습니다: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }
}
