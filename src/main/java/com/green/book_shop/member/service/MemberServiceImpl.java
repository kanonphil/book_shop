package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.mapper.MemberMapper;
import com.green.book_shop.util.PasswordUtil;  // 변경
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
  private final MemberMapper memberMapper;
  private final PasswordEncoder passwordEncoder;

  // 회원가입
  @Transactional
  public void joinMember(MemberDTO memberDTO) {
    // 일반 회원가입 필수 항목 검증
    if (memberDTO.getMemPw() == null || memberDTO.getMemPw().isEmpty()) {
      throw new RuntimeException("비밀번호는 필수입니다");
    }

    if (memberDTO.getMemTel() == null || memberDTO.getMemTel().isEmpty()) {
      throw new RuntimeException("전화번호는 필수입니다");
    }

    // 이메일 중복 확인
    if (memberMapper.checkEmailDuplicate(memberDTO.getMemEmail()) > 0) {
      throw new RuntimeException("이미 사용 중인 이메일입니다");
    }

    // 비밀번호 암호화
    String encodedPassword = passwordEncoder.encode(memberDTO.getMemPw());
    memberDTO.setMemPw(encodedPassword);

    // provider를 'local'로 설정
    memberDTO.setProvider("local");

    // 회원 등록
    memberMapper.insertMember(memberDTO);
  }

  // 이메일 중복 확인
  public boolean checkEmailDuplicate(String memEmail) {
    return memberMapper.checkEmailDuplicate(memEmail) > 0;
  }

  // 로그인하려는 회원 정보 조회
  public MemberDTO getMemberForLogin(String memEmail) {
    return memberMapper.getMemberForLogin(memEmail);
  }

  // 로그인
  public MemberDTO login(String memEmail, String memPw) {
    // 이메일로 회원 조회
    MemberDTO member = memberMapper.getMemberForLogin(memEmail);

    if (member == null) {
      throw new RuntimeException("존재하지 않는 회원입니다");
    }

    // 비밀번호 확인
    if (!passwordEncoder.matches(memPw, member.getMemPw())) {
      throw new RuntimeException("비밀번호가 일치하지 않습니다");
    }

    // 계정 상태 확인
    if ("N".equals(member.getIsUsing())) {
      throw new RuntimeException("비활성화된 계정입니다");
    }

    // 비밀번호 정보 제거 (보안)
    member.setMemPw(null);

    return member;
  }

  // 회원 정보 조회
  public MemberDTO getMemberInfo(String memEmail) {
    return memberMapper.selectMemberInfo(memEmail);
  }
}