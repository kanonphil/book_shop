package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.CustomUserDetails;
import com.green.book_shop.member.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
  private final MemberService memberService;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    log.info("loadUserByUsername 메서드 실행");
    MemberDTO dto = memberService.getMemberForLogin(username);

    if (dto == null) {
      log.info("=======일치하는 아이디 없음=======");
      // 401 상태 코드 반환
      throw new UsernameNotFoundException("없는 아이디: " + username);
    }

    // isUsing 체크 추가
    if ("N".equals(dto.getIsUsing())) {
      throw new DisabledException("비활성화된 계정입니다: " + username);
    }

    // 조회한 로그인 정보를 UserDetails 인터페이스를 상속한 CustomUserDetails 클래스에 저장하여 리턴.
    // 리턴된 UserDetails 객체를 AuthenticationManager가 전달받아 로그인 검증을 실행
    return new CustomUserDetails(dto);
  }
}
