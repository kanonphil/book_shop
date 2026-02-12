package com.green.book_shop.member.dto;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
  private final MemberDTO memberDTO;

  @Override // 계정의 권한정보를 리턴하는 메서드
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> collection = new ArrayList<>();

    collection.add(new GrantedAuthority() {
      @Override
      public String getAuthority() {
        return memberDTO.getMemRole();
      }
    });

    return collection;
  }

  @Override // 계정의 비밀번호를 리턴
  public String getPassword() {
    return memberDTO.getMemPw();
  }

  @Override // 계정의 아이디를 리턴
  public String getUsername() {
    return memberDTO.getMemEmail();
  }

  // 만료되지 않은 계정인가?
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  // 잠기지 않은 계정인가?
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  // 자격증명이 만료되지 않았는가?
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  // 사용가능 상태의 계정인가?
  @Override
  public boolean isEnabled() {
    return true;
  }

  public MemberDTO getMemberDTO() {
    return memberDTO;
  }
}
