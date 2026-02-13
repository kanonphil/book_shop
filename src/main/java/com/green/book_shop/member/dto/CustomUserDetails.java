package com.green.book_shop.member.dto;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
  private final MemberDTO member;

  // ✅ 외부에서 MemberDTO 접근 가능하도록 getter 추가
  public MemberDTO getMemberDTO() {
    return member;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    // ✅ ROLE_ 접두사 추가
    return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + member.getMemRole())
    );
  }

  @Override
  public String getPassword() {
    return member.getMemPw();
  }

  @Override
  public String getUsername() {
    return member.getMemEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}