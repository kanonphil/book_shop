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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class JwtConfirmFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    log.info("JwtConfirmFilter - doFilterinternal() 메서드 실행되어, token 검증 시작");

    String authorization = request.getHeader("Authorization");

    if (authorization == null || !authorization.startsWith("Bearer ")) {
      log.info("토큰이 존재하지 않습니다.");
      filterChain.doFilter(request, response);
      return;
    }

    String token = authorization.split(" ")[1];

    if (jwtUtil.isExpired(token)) {
      log.info("만료된 토큰입니다.");
      filterChain.doFilter(request, response);
      return;
    }

    log.info("정상적으로 토큰이 검증되었습니다.");

    // 토큰에서 username과 role 획득
    String username = jwtUtil.getUsername(token);
    String role = jwtUtil.getRole(token);

    // ✅ 토큰에서 가져온 role 로깅
    log.info("JWT에서 추출한 role: {}", role);

    // userEntity를 생성하여 값 set
    MemberDTO member = new MemberDTO();
    member.setMemEmail(username);
    member.setMemRole(role);

    // ✅ MemberDTO에 저장된 role 로깅
    log.info("MemberDTO에 설정된 role: {}", member.getMemRole());

    // UserDetails에 회원 정보 객체 담기
    CustomUserDetails customUserDetails = new CustomUserDetails(member);

    // ✅ CustomUserDetails의 권한 로깅
    String authorities = customUserDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(", "));
    log.info("CustomUserDetails 권한: {}", authorities);

    // spring security 인증 토큰 생성
    Authentication authToken = new UsernamePasswordAuthenticationToken(
            customUserDetails,
            null,
            customUserDetails.getAuthorities()
    );

    // ✅ 최종 Authentication 권한 로깅
    String finalAuthorities = authToken.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(", "));
    log.info("최종 Authentication 권한: {}", finalAuthorities);

    // 세션에 사용자 저장
    SecurityContextHolder.getContext().setAuthentication(authToken);

    filterChain.doFilter(request, response);
  }
}