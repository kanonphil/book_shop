package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final MemberMapper memberMapper;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);

    String provider = userRequest.getClientRegistration().getRegistrationId(); // google, naver

    String providerId = null;
    String email = null;
    String name = null;

    // provider별로 다른 처리
    if ("google".equals(provider)) {
      providerId = oAuth2User.getAttribute("sub");
      email = oAuth2User.getAttribute("email");
      name = oAuth2User.getAttribute("name");

    } else if ("naver".equals(provider)) {
      // 네이버는 response 안에 데이터가 있음
      Map<String, Object> response = oAuth2User.getAttribute("response");
      if (response != null) {
        providerId = (String) response.get("id");
        email = (String) response.get("email");
        name = (String) response.get("name");
      }
    }

    // DB에서 회원 조회
    MemberDTO member = memberMapper.selectMemberByProviderAndProviderId(provider, providerId);

    if (member == null) {
      // 신규 회원 - 자동 가입
      member = new MemberDTO();
      member.setMemEmail(email);
      member.setMemName(name);
      member.setProvider(provider);
      member.setProviderId(providerId);
      member.setMemPw(null); // SNS 로그인은 비밀번호 없음

      memberMapper.insertMember(member);
    }

    return oAuth2User;
  }
}