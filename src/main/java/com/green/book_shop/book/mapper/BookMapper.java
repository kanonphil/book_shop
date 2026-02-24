package com.green.book_shop.book.mapper;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.dto.BookImgDTO;
import com.green.book_shop.book.dto.BookSearchDTO;
import com.green.book_shop.book.dto.StockDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.awt.print.Book;
import java.util.List;

@Mapper
public interface BookMapper {
  // 도서 등록
  int insertBook(BookDTO bookDTO);

  // 도서 목록 조회 (페이징)
  List<BookDTO> selectBookList(@Param("offset") int offset, @Param("size") int size);

  // 베스트셀러
  List<BookDTO> selectBestSellers(@Param("size") int size);

  // 도서 총 개수
  int selectBookCount();

  // 도서 상세 조회
  BookDTO selectBookDetail(@Param("bookNum") Integer bookNum);

  // 카테고리별 도서 목록
  List<BookDTO> selectBookListByCategory(@Param("cateNum") Integer cateNum,
                                         @Param("offset") int offset,
                                         @Param("size") int size);

  // 카테고리별 도서 개수
  int selectBookCountByCategory(@Param("cateNum") Integer cateNum);

  // 도서 검색
  List<BookDTO> searchBooks(BookSearchDTO searchDTO);

  // 검색 결과 개수
  int searchBooksCount(@Param("keyword") String keyword);

  // 도서 수정
  int updateBook(BookDTO bookDTO);

  // 도서 삭제
  int deleteBook(@Param("bookNum") Integer bookNum);

  // 재고 업데이트 (덮어쓰기)
  int updateBookStock(@Param("bookNum") Integer bookNum, @Param("quantity") int quantity);

  // 재고 관리용 목록 조회 (검색 + 부족 필터)
  List<StockDTO> selectStockList(@Param("keyword") String keyword,
                                 @Param("lowStockOnly") boolean lowStockOnly);

  // 입고 처리 (현재 재고에 더하기)
  int addBookStock(@Param("bookNum") Integer bookNum,
                   @Param("addQuantity") int addQuantity);
}