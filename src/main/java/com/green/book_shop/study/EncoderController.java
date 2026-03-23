package com.green.book_shop.study;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/encode")
public class EncoderController {
  PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @GetMapping("/test1")
  public void test1(){
    String encode1 = passwordEncoder.encode("java");
    System.out.println("encode1 = " + encode1);

    String encode2 = passwordEncoder.encode("java");
    System.out.println("encode2 = " + encode2);

    // 원본데이터와 암호화된 데이터의 일치 여부 판단 (true, false)
    // 첫 번째 매개변수: 암호화되지 않은 문자열
    // 두 번째 매개변수: 암호화한 문자열
    boolean result1 = passwordEncoder.matches("java", encode1);
    boolean result2 = passwordEncoder.matches("java1", encode1);

    System.out.println(result1);
    System.out.println(result2);
  }
}
