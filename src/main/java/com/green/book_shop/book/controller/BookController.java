package com.green.book_shop.book.controller;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.dto.BookListResponseDTO;
import com.green.book_shop.book.dto.StockDTO;
import com.green.book_shop.book.service.BookService;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
@Slf4j
public class BookController {
  private final BookService bookService;

  /**
   * 도서 목록 조회 (페이징)
   * GET /books?page=1&size=8
   */
  @GetMapping("")
  public ResponseEntity<?> getBookList(
          @RequestParam(defaultValue = "1") int page,
          @RequestParam(defaultValue = "8") int size
  ) {
    log.info("도서 목록 조회 요청 - page: {}, size: {}", page, size);

    BookListResponseDTO response = bookService.getBookList(page, size);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", response);

    return ResponseEntity.ok(result);
  }

  /**
   * 베스트셀러
   * GET /books/best-sellers
   */
  @GetMapping("/best-sellers")
  public ResponseEntity<?> getBestSellers(
          @RequestParam(defaultValue = "8") int size
  ) {
    List<BookDTO> books = bookService.getBestSellers(size);
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", books);
    return ResponseEntity.ok(result);
  }

  /**
   * 도서 상세 조회
   * GET /books/1
   */
  @GetMapping("/{bookNum}")
  public ResponseEntity<?> getBookDetail(@PathVariable Integer bookNum) {
    log.info("도서 상세 조회 요청 - bookNum: {}", bookNum);

    BookDTO book = bookService.getBookDetail(bookNum);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", book);

    return ResponseEntity.ok(result);
  }

  /**
   * 카테고리별 도서 목록
   * GET /books/category/1?page=1&size=8
   */
  @GetMapping("/category/{cateNum}")
  public ResponseEntity<?> getBookListByCategory(
          @PathVariable Integer cateNum,
          @RequestParam(defaultValue = "1") int page,
          @RequestParam(defaultValue = "8") int size
  ) {
    log.info("카테고리별 도서 조회 요청 - cateNum: {}, page: {}", cateNum, page);

    BookListResponseDTO response = bookService.getBookListByCategory(cateNum, page, size);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", response);

    return ResponseEntity.ok(result);
  }

  /**
   * 도서 검색
   * GET /books/search?keyword=클린&page=1&size=8
   */
  @GetMapping("/search")
  public ResponseEntity<?> searchBooks(
          @RequestParam String keyword,
          @RequestParam(defaultValue = "1") int page,
          @RequestParam(defaultValue = "8") int size
  ) {
    log.info("도서 검색 요청 - keyword: {}, page: {}", keyword, page);

    BookListResponseDTO response = bookService.searchBooks(keyword, page, size);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", response);

    return ResponseEntity.ok(result);
  }

  /**
   * 도서 등록 (관리자/매니저만)
   * POST /books
   */
  @PostMapping("")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> regBook(@RequestPart("bookData") BookDTO bookDTO,
                                   @RequestPart(value = "mainImg", required = false) MultipartFile mainImg,
                                   @RequestPart(value = "subImgs", required = false) List<MultipartFile> subImgs) {
    log.info("도서 등록 요청 - 제목: {}", bookDTO.getBookTitle());

    bookService.regBook(bookDTO, mainImg, subImgs);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "도서가 등록되었습니다.");

    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  /**
   * 도서 수정 (관리자/매니저만)
   * PUT /books/1
   */
  @PutMapping("/{bookNum}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> updateBook(
          @PathVariable Integer bookNum,
          @RequestBody BookDTO bookDTO,
          @RequestPart(value = "mainImg", required = false) MultipartFile mainImg,
          @RequestPart(value = "subImgs", required = false) List<MultipartFile> subImgs
  ) {
    log.info("도서 수정 요청 - bookNum: {}", bookNum);

    bookDTO.setBookNum(bookNum);
    bookService.updateBook(bookDTO, mainImg, subImgs);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "도서가 수정되었습니다.");

    return ResponseEntity.ok(result);
  }

  /**
   * 도서 삭제 (관리자만)
   * DELETE /books/1
   */
  @DeleteMapping("/{bookNum}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteBook(@PathVariable Integer bookNum) {
    log.info("도서 삭제 요청 - bookNum: {}", bookNum);

    bookService.deleteBook(bookNum);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "도서가 삭제되었습니다.");

    return ResponseEntity.ok(result);
  }

  /**
   * 재고 업데이트 (관리자/매니저만)
   * PATCH /books/{bookNum}/stock
   */
  @PatchMapping("/stock/{bookNum}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> updateStock(
          @PathVariable Integer bookNum,
          @RequestParam int quantity
  ) {
    log.info("재고 업데이트 요청 - bookNum: {}, quantity: {}", bookNum, quantity);

    bookService.updateStock(bookNum, quantity);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "재고가 업데이트되었습니다.");

    return ResponseEntity.ok(result);
  }

  /**
   * 재고 목록 조회
   * GET /books/stock
   */
  @GetMapping("/stock")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> getStockList(
          @RequestParam(required = false) String keyword,
          @RequestParam(defaultValue = "false") boolean lowStockOnly
  ) {
    List<StockDTO> stocks = bookService.getStockList(keyword, lowStockOnly);
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("data", stocks);

    return ResponseEntity.ok(result);
  }

  /**
   * 입고 처리
   * POST /books/restock/{bookNum}
   */
  @PostMapping("/restock/{bookNum}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  public ResponseEntity<?> restockBook(
          @PathVariable("bookNum") Integer bookNum,
          @RequestParam int addQuantity
  ) {
    bookService.addStock(bookNum, addQuantity);
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "입고 처리가 완료되었습니다.");

    return ResponseEntity.ok(result);
  }
}