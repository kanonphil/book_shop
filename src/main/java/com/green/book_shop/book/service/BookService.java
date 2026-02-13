package com.green.book_shop.book.service;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.dto.BookListResponseDTO;
import com.green.book_shop.book.dto.BookSearchDTO;
import com.green.book_shop.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {
  private final BookMapper bookMapper;

  // 도서 등록
  public void regBook(BookDTO bookDTO) {
    bookMapper.insertBook(bookDTO);
    log.info("도서 등록 완료 - 제목: {}", bookDTO.getBookTitle());
  }

  // 도서 목록 조회 (페이징)
  public BookListResponseDTO getBookList(int page, int size) {
    // offset 계산 (page는 1부터 시작)
    int offset = (page - 1) * size;

    // 도서 목록 조회
    List<BookDTO> books = bookMapper.selectBookList(offset, size);

    // 전체 도서 개수 조회
    int totalElements = bookMapper.selectBookCount();

    // 전체 페이지 수 계산
    int totalPages = (int) Math.ceil((double) totalElements / size);

    log.info("도서 목록 조회 - page: {}, size: {}, totalElements: {}", page, size, totalElements);

    return BookListResponseDTO.builder()
            .books(books)
            .currentPage(page)
            .totalPages(totalPages)
            .totalElements(totalElements)
            .size(size)
            .build();
  }

  // 도서 상세 조회
  public BookDTO getBookDetail(Integer bookNum) {
    BookDTO book = bookMapper.selectBookDetail(bookNum);

    if (book == null) {
      throw new RuntimeException("도서를 찾을 수 없습니다. BOOK_NUM: " + bookNum);
    }

    log.info("도서 상세 조회 - bookNum: {}, title: {}", bookNum, book.getBookTitle());

    return book;
  }

  // 카테고리별 도서 목록
  public BookListResponseDTO getBookListByCategory(Integer cateNum, int page, int size) {
    int offset = (page - 1) * size;

    List<BookDTO> books = bookMapper.selectBookListByCategory(cateNum, offset, size);
    int totalElements = bookMapper.selectBookCountByCategory(cateNum);
    int totalPages = (int) Math.ceil((double) totalElements / size);

    log.info("카테고리별 도서 목록 조회 - cateNum: {}, page: {}", cateNum, page);

    return BookListResponseDTO.builder()
            .books(books)
            .currentPage(page)
            .totalPages(totalPages)
            .totalElements(totalElements)
            .size(size)
            .build();
  }

  // 도서 검색
  public BookListResponseDTO searchBooks(String keyword, int page, int size) {
    int offset = (page - 1) * size;

    BookSearchDTO searchDTO = new BookSearchDTO();
    searchDTO.setKeyword(keyword);
    searchDTO.setOffset(offset);
    searchDTO.setSize(size);

    List<BookDTO> books = bookMapper.searchBooks(searchDTO);
    int totalElements = bookMapper.searchBooksCount(keyword);
    int totalPages = (int) Math.ceil((double) totalElements / size);

    log.info("도서 검색 - keyword: {}, page: {}, results: {}", keyword, page, totalElements);

    return BookListResponseDTO.builder()
            .books(books)
            .currentPage(page)
            .totalPages(totalPages)
            .totalElements(totalElements)
            .size(size)
            .build();
  }

  // 도서 수정
  public void updateBook(BookDTO bookDTO) {
    int result = bookMapper.updateBook(bookDTO);

    if (result == 0) {
      throw new RuntimeException("도서를 찾을 수 없습니다. BOOK_NUM: " + bookDTO.getBookNum());
    }

    log.info("도서 수정 완료 - bookNum: {}", bookDTO.getBookNum());
  }

  // 도서 삭제
  public void deleteBook(Integer bookNum) {
    int result = bookMapper.deleteBook(bookNum);

    if (result == 0) {
      throw new RuntimeException("도서를 찾을 수 없습니다. BOOK_NUM: " + bookNum);
    }

    log.info("도서 삭제 완료 - bookNum: {}", bookNum);
  }

  // 재고 업데이트
  public void updateStock(Integer bookNum, int quantity) {
    int result = bookMapper.updateBookStock(bookNum, quantity);

    if (result == 0) {
      throw new RuntimeException("도서를 찾을 수 없습니다. BOOK_NUM: " + bookNum);
    }

    log.info("재고 업데이트 완료 - bookNum: {}, quantity: {}", bookNum, quantity);
  }
}