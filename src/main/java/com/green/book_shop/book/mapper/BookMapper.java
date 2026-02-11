package com.green.book_shop.book.mapper;

import com.green.book_shop.book.dto.BookDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookMapper {
  // 도서 등록
  int insertBook(BookDTO bookDTO);
}
