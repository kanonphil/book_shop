package com.green.book_shop.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.green.book_shop.jwt.JwtUtil;
import com.green.book_shop.member.dto.CustomUserDetails;
import com.green.book_shop.member.dto.MemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  public LoginFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;

    setFilterProcessesUrl("/member/login");
    setUsernameParameter("memEmail");
    setPasswordParameter("memPw");
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    log.info("로그인 시도 - attemptAuthentication 실행");

    MemberDTO vo = new MemberDTO();
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      ServletInputStream inputStream = request.getInputStream();
      String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
      vo = objectMapper.readValue(messageBody, MemberDTO.class);
    } catch (Exception e) {
      log.error("로그인 요청 파싱 실패", e);
      throw new RuntimeException(e);
    }

    log.info("로그인 시도 - 아이디: {}", vo.getMemEmail());

    UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(vo.getMemEmail(), vo.getMemPw(), null);

    return authenticationManager.authenticate(authToken);
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {

    CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
    String username = authResult.getName();

    // ✅ 권한 정보 추출
    String role = authResult.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElse("ROLE_USER");

    // ✅ ROLE_ 접두사 제거
    if (role.startsWith("ROLE_")) {
      role = role.substring(5);  // "ROLE_MANAGER" -> "MANAGER"
    }

    log.info("로그인 성공 - 사용자: {}, 권한: {}", username, role);

    // ✅ ROLE_ 없이 토큰 생성
    String accessToken = jwtUtil.createJwt(username, role, (1000 * 60 * 10));

    // 응답 데이터 구성
    Map<String, Object> responseData = new HashMap<>();
    responseData.put("success", true);
    responseData.put("message", "로그인 성공");
    responseData.put("memEmail", username);
    responseData.put("memName", userDetails.getMemberDTO().getMemName());
    responseData.put("memRole", role);  // ✅ "MANAGER" (ROLE_ 없이)
    responseData.put("token", accessToken);

    response.setHeader("Access-Control-Expose-Headers", "Authorization");
    response.setHeader("Authorization", "Bearer " + accessToken);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.setStatus(HttpStatus.OK.value());

    ObjectMapper objectMapper = new ObjectMapper();
    String jsonResponse = objectMapper.writeValueAsString(responseData);
    response.getWriter().write(jsonResponse);
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
    log.warn("로그인 실패 - 사유: {}", failed.getMessage());

    Map<String, Object> responseData = new HashMap<>();
    responseData.put("success", false);
    responseData.put("message", "ID 또는 Password가 일치하지 않습니다.");

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.setStatus(HttpStatus.UNAUTHORIZED.value());

    ObjectMapper objectMapper = new ObjectMapper();
    String jsonResponse = objectMapper.writeValueAsString(responseData);
    response.getWriter().write(jsonResponse);
  }
}