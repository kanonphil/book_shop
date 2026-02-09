package com.green.book_shop.member.mapper;

import com.green.book_shop.member.dto.MemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
  // 회원가입
  void insertMember(MemberDTO memberDTO);

  // 이메일 중복 확인
  int checkEmailDuplicate(String memEmail);

  // 로그인 (이메일로 회원 조회)
  MemberDTO selectMemberByEmail(String memEmail);

  // 회원 정보 조회
  MemberDTO selectMemberInfo(String memEmail);
}
