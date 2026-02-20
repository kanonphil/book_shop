package com.green.book_shop.book.service;

import com.green.book_shop.book.dto.BookImgDTO;
import com.green.book_shop.book.mapper.BookImgMapper;
import com.green.book_shop.util.UploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookImgService {
  private final BookImgMapper bookImgMapper;
  private final UploadUtil uploadUtil;

  // 이미지 저장 (도서 등록 시 BookService에서 호출)
  public void saveImgs(int bookNum, MultipartFile mainImg, List<MultipartFile> subImgs) {
    List<BookImgDTO> imgList = new ArrayList<>();

    if (mainImg != null) {
      imgList.add(uploadUtil.saveMainImg(mainImg, bookNum));
    }
    if (subImgs != null && !subImgs.isEmpty()) {
      imgList.addAll(uploadUtil.saveSubImgs(subImgs, bookNum));
    }

    if (!imgList.isEmpty()) {
      bookImgMapper.insertBookImgs(imgList);
      log.info("이미지 저장 완료 - bookNum: {}, 총 {}장", bookNum, imgList.size());
    }
  }
}
