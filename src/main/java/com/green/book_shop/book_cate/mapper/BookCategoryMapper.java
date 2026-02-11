package com.green.book_shop.book_cate.mapper;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookCategoryMapper {
  // 모든 카테고리 조회
  List<BookCategoryDTO> selectAllCategories();
}
