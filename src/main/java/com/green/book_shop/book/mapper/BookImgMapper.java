package com.green.book_shop.book.mapper;

import com.green.book_shop.book.dto.BookImgDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookImgMapper {
  // 이미지 등록
  int insertBookImgs(List<BookImgDTO> imgList);
}
