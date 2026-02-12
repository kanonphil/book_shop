package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberDTO;

public interface MemberService {
  // 로그인하려는 회원 정보 조회
  public MemberDTO getMemberForLogin(String memEmail);
}
