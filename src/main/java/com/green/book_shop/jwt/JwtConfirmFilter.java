package com.green.book_shop.jwt;

import com.green.book_shop.member.dto.CustomUserDetails;
import com.green.book_shop.member.dto.MemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtConfirmFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    log.info("JwtConfirmFilter - doFilterinternal() 메서드 실행되어, token 검증 시작");

    // 요청 시 전달되는 Authorization 헤더를 찾음
    String authorization = request.getHeader("Authorization");

    // Authorization 헤더가 없거나, 토큰이 Bearer로 시작하지 않으면...
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      log.info("토큰이 존재하지 않습니다.");
      filterChain.doFilter(request, response);

      return; // 조건이 해당되면 메소드 종료 (필수)
    }

    // Bearer 부분 제거 후 순수 토큰만 획득
    String token = authorization.split(" ")[1];

    // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
    if (jwtUtil.isExpired(token)) {
      log.info("만료된 토큰입니다.");
      filterChain.doFilter(request, response);

      return; // 조건이 해당되면 메소드 종료 (필수)
    }

    log.info("정상적으로 토큰이 검증되었습니다.");

    // 토큰에서 username과 role 획득
    String username = jwtUtil.getUsername(token);
    String role = jwtUtil.getRole(token);

    // userEntity를 생성하여 값 set
    MemberDTO member = new MemberDTO();
    member.setMemEmail(username);
    member.setMemRole(role);

    // UserDetails에 회원 정보 객체 담기
    CustomUserDetails customUserDetails = new CustomUserDetails(member);

    // spring security 인증 토큰 생성
    Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

    // 세션에 사용자 저장. 일시적으로 세션에 사용자 정보를 저장하는 이유는 유저의 권한 체크 때문이다.
    SecurityContextHolder.getContext().setAuthentication(authToken);

    filterChain.doFilter(request, response);
  }
}
