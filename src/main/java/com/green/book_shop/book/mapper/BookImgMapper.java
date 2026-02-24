package com.green.book_shop.book.mapper;

import com.green.book_shop.book.dto.BookImgDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookImgMapper {
  // 이미지 등록
  int insertBookImgs(List<BookImgDTO> imgList);

  // 이미지 단건 조회 (삭제 전 파일명 알아야 실제 파일도 지울 수 있음)
  BookImgDTO selectBookImg(int imgNum);

  // 이미지 삭제
  int deleteBookImg(int imgNum);
}
