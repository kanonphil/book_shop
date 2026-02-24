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

  public void deleteImg(int imgNum) {
    // 1. 먼저 이미지 정보 조회 (파일명 가져오기)
    BookImgDTO img = bookImgMapper.selectBookImg(imgNum);

    if (img == null) {
      throw new RuntimeException("이미지를 찾을 수 없습니다. IMG_NUM: " + imgNum);
    }

    // 2. DB에서 삭제
    bookImgMapper.deleteBookImg(imgNum);

    // 3. 실제 파일 삭제
    uploadUtil.deleteFile(img.getUploadFileName());

    log.info("이미지 삭제 완료 - imgNum: {}, fileName: {}", imgNum, img.getUploadFileName());
  }
}
