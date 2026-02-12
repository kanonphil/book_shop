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
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  // 생성자를 통해 AuthenticationManager 객체를 의존성 주입 받는다.
  public LoginFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;

    // 로그인 요청 url 설정
    setFilterProcessesUrl("/member/login");
    // 전달된느 아이디, 비번 key값 변경
    setUsernameParameter("memEmail");
    setPasswordParameter("memPw");
  }

  // 로그인 절차가 진행되면 LoginFilter 클래스의 attemptAuthentication() 메서드가 실행된다
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    log.info("attemptAuthentication method run");

    MemberDTO vo = new MemberDTO();
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      ServletInputStream inputStream = request.getInputStream();
      String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
      vo = objectMapper.readValue(messageBody, MemberDTO.class);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
    log.info("입력받은 아이디: ", vo.getMemEmail());
    log.info("입력받은 비밀번호: ", vo.getMemPw());

    // 우리가 입력한 아이디와 비밀번호를 데이터베이스에 저장한 정보와 일치하는지 검증하는 로직은
    // AuthenticationManager가 담당하기 때문에 전달받은 아이디와 비밀번호를 AuthenticationManager에 전달해줘야 한다.
    // 이때 아이디와 비밀번호를 그냥 전달하는 것이 아니라 UsernamePasswordAuthenticationToken 객체에 실어 보낸다.
    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(vo.getMemEmail(), vo.getMemPw(), null);

    // 아이디와 비번을 담고 있는 authToken 객체를 authenticationManager에 전달, authenticationManager는 로그인을 검증하는 기능을 함
    // 로그인을 검증하는 방법 -> UserDetailsService의 loadUserByUsername 메서드를 호출하여 검증
    // loadUsesrByUsername() 메서드의 실행 결과로 로그인 유저의 정보를 authentication 객체에 담아 옴
    Authentication authentication = authenticationManager.authenticate(authToken);
    log.info("DB에서 로그인 가능 여부 확인 완료(UserDetailService의 loadUserByUsername 메서드 정상 실행 됨). 만약 검증에 실패했다면 본 출력문은 실행 안 됨");
    log.info("로그인 중인 유저: ", authentication.getName());

    // 로그인 유저의 정보가 담긴 authentication 객체를 리턴하면 authentication 객체가 session에 저장됨
    // 세션에 저장하는 이유는 security의 권한 처리를 위해서는 세션에 로그인 정보가 있어야 되기 때문.
    return authentication;
  }

  // 로그인 검증이 성공했을 때 실행되는 메서드
  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
    log.info("로그인 검증 성공! successfulAuthentication 메서드 호출");

    // 인증된 사용자 정보 추출
    CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
    // 토큰 생성을 위한 아이디 정보 추출
    String username = authResult.getName();

    // 토큰 생성을 위한 권한 정보 추출
    Collection<? extends GrantedAuthority> authorities = authResult.getAuthorities();
    Iterator<? extends  GrantedAuthority> iterator = authorities.iterator();
    GrantedAuthority auth = iterator.next();
    String role = auth.getAuthority();

    // 토큰 생성
    String accessToken = jwtUtil.createJwt(username, role, (1000 * 60 * 10)); // 10분

    // ✅ 응답 데이터 구성 (이메일, 이름, 권한)
    Map<String, Object> responseData = new HashMap<>();
    responseData.put("success", true);
    responseData.put("message", "로그인 성공");
    responseData.put("memEmail", username);
    responseData.put("memName", userDetails.getMemberDTO().getMemName());  // 이름 추가 필요
    responseData.put("memRole", role);
    responseData.put("token", accessToken);  // 토큰도 함께 전달 (선택사항)

    // 생성한 토큰을 응답 헤더에 담아 클라이언트에 전달
    response.setHeader("Access-Control-Expose-Headers", "Authorization");
    response.setHeader("Authorization", "Bearer " + accessToken);
    response.setStatus(HttpStatus.OK.value());  // 클라이언트에 200 응답

    ObjectMapper objectMapper = new ObjectMapper();
    String jsonResponse = objectMapper.writeValueAsString(responseData);
    response.getWriter().write(jsonResponse);
  }

  // 로그인 검증이 실패했을 때 실행되는 메서드, 아이디는 맞지만 비번이 틀렸을 경우 실행
  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
    log.info("로그인 검증 실패! unsuccessfulAuthentication 메서드 호출");

    // 실패 응답도 JSON으로
    Map<String, Object> responseData = new HashMap<>();
    responseData.put("success", false);
    responseData.put("message", "ID 또는 Password가 일치하지 않습니다.");

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    // 로그인 실패 시 401 응답 코드 반환
    response.setStatus(401);

    ObjectMapper objectMapper = new ObjectMapper();
    String jsonResponse = objectMapper.writeValueAsString(responseData);
    response.getWriter().write(jsonResponse);
  }
}
