package com.green.book_shop.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {
  // 비밀번호 암호화
  public static String encode(String password) {
    return BCrypt.hashpw(password, BCrypt.gensalt());
  }

  // 비밀번호 확인
  public static boolean matches(String rawPassword, String encodedPassword) {
    return BCrypt.checkpw(rawPassword, encodedPassword);
  }
}
