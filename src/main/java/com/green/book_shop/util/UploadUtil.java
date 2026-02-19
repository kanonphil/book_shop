package com.green.book_shop.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class UploadUtil {
  @Value("${file.upload.path}")
  private String uploadPath;

  // 파일 저장 후 저장된 파일명 반환
  public String saveFile(MultipartFile file) {
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
}
