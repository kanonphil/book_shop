package com.green.book_shop.book_cate.mapper;

import com.green.book_shop.book_cate.dto.BookCategoryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookCategoryMapper {
  // 모든 카테고리 조회
  List<BookCategoryDTO> selectAllCategories();

  // 카테고리 추가
  int insertCategory(BookCategoryDTO bookCategoryDTO);

  // 카테고리 수정
  int updateCategory(BookCategoryDTO bookCategoryDTO);

  // 카테고리 삭제
  int deleteCategory(@Param("cateNum") Integer cateNum);

  // 해당 카테고리에 속한 도서 수 조회 (삭제 전 검증)
  int selectBookCountByCateNum(@Param("cateNum") Integer cateNum);
}
