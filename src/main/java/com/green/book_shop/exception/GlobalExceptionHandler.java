package com.green.book_shop.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  // 데이터를 찾을 수 없을 때 (도서 없음, 이미지 없음 등)
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
    log.error("RuntimeException: {}", e.getMessage());

    Map<String, Object> error = new HashMap<>();
    error.put("success", false);
    error.put("message", e.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  // 그 외 예상치 못한 에러
  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleException(Exception e) {
    log.error("Exception: ", e);

    Map<String, Object> error = new HashMap<>();
    error.put("success", false);
    error.put("message", "서버 오류가 발생했습니다.");

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
