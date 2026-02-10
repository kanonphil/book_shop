package com.green.book_shop.config;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.mapper.MemberMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final MemberMapper memberMapper;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

    // provider 확인
    String provider = request.getRequestURI().contains("google") ? "google" : "naver";

    String email = null;
    String providerId = null;

    if ("google".equals(provider)) {
      email = oAuth2User.getAttribute("email");
      providerId = oAuth2User.getAttribute("sub");
    } else if ("naver".equals(provider)) {
      Map<String, Object> naverResponse = oAuth2User.getAttribute("response");
      if (naverResponse != null) {
        email = (String) naverResponse.get("email");
        providerId = (String) naverResponse.get("id");
      }
    }

    // provider와 providerId로 회원 조회
    MemberDTO member = memberMapper.selectMemberByProviderAndProviderId(provider, providerId);

    if (member == null) {
      // 회원을 찾지 못한 경우 에러 페이지로
      getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/login-select?error=true");
      return;
    }

    // 프론트엔드로 리다이렉트
    String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth-callback")
            .queryParam("email", member.getMemEmail())
            .queryParam("name", URLEncoder.encode(member.getMemName(), StandardCharsets.UTF_8))
            .queryParam("role", member.getMemRole())
            .build()
            .toUriString();

    getRedirectStrategy().sendRedirect(request, response, targetUrl);
  }
}