package com.green.book_shop.member.mapper;

import com.green.book_shop.member.dto.MemberDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
  // 회원가입
  void insertMember(MemberDTO memberDTO);

  // 이메일 중복 확인
  int checkEmailDuplicate(String memEmail);

  // 이메일로 회원 조회 (일반 로그인)
  MemberDTO getMemberForLogin(String memEmail);

  // OAuth: provider와 providerId로 회원 조회 (추가)
  MemberDTO selectMemberByProviderAndProviderId(String provider, String providerId);

  // 회원 정보 조회
  MemberDTO selectMemberInfo(String memEmail);
}
