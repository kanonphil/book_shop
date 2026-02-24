package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberDTO;

public interface MemberService {
  // 로그인하려는 회원 정보 조회
  MemberDTO getMemberForLogin(String memEmail);

  // 회원 정보 수정
  void updateMember(MemberDTO memberDTO);

  // 회원 탈퇴
  void deleteMember(String memEmail, String memPw);

  // 비밀번호 확인
  boolean checkPassword(String memEmail, String memPw);
}
