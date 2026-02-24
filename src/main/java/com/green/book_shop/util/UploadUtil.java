package com.green.book_shop.util;

import com.green.book_shop.book.dto.BookImgDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UploadUtil {
  @Value("${file.upload.path}")
  private String uploadPath;

  // 파일 저장 후 저장된 파일명 반환
  private String saveFile(MultipartFile file) {
    // UUID로 파일명 중복 방지
    String originalFilename = file.getOriginalFilename();
    String extension = (originalFilename != null && originalFilename.contains("."))
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";  // 확장자 없으면 기본값
    String uploadFileName = UUID.randomUUID().toString() + extension;

    Path savePath = Paths.get(uploadPath + uploadFileName); // 저장 경로
    try {
      Files.write(savePath, file.getBytes());
    } catch (IOException e) {
      throw new RuntimeException("파일 저장 실패", e);
    }

    return uploadFileName;
  }

  // 단일 이미지 저장 후 DTO 반환
  public BookImgDTO saveMainImg(MultipartFile file, int bookNum) {
    BookImgDTO imgDTO = new BookImgDTO();
    imgDTO.setOriginFileName(file.getOriginalFilename());
    imgDTO.setUploadFileName(saveFile(file));
    imgDTO.setIsMain("Y");
    imgDTO.setBookNum(bookNum);
    return imgDTO;
  }

  // 다중 이미지 저장 후 DTO 리스트 반환
  public List<BookImgDTO> saveSubImgs(List<MultipartFile> files, int bookNum) {
    return files.stream()
            .map(file -> {
              BookImgDTO imgDTO = new BookImgDTO();
              imgDTO.setOriginFileName(file.getOriginalFilename());
              imgDTO.setUploadFileName(saveFile(file));
              imgDTO.setIsMain("N");
              imgDTO.setBookNum(bookNum);
              return imgDTO;
            })
            .collect(Collectors.toList());
  }

  // 파일 삭제
  public void deleteFile(String uploadFileName) {
    if (uploadFileName == null || uploadFileName.isEmpty()) return;

    Path filePath = Paths.get(uploadPath + uploadFileName);
    try {
      Files.deleteIfExists(filePath);
    } catch (IOException e) {
      throw new RuntimeException("파일 삭제 실패: " + uploadFileName, e);
    }
  }
}
