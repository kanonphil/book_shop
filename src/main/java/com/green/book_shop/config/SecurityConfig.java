package com.green.book_shop.config;

import com.green.book_shop.member.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final CustomOAuth2UserService customOAuth2UserService;
  private final OAuth2SuccessHandler oAuth2SuccessHandler;

  public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                        OAuth2SuccessHandler oAuth2SuccessHandler) {
    this.customOAuth2UserService = customOAuth2UserService;
    this.oAuth2SuccessHandler = oAuth2SuccessHandler;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
            )
            .oauth2Login(oauth -> oauth
                    .successHandler(oAuth2SuccessHandler)  // 핸들러 추가
                    .failureUrl("http://localhost:5173/login-select?error=true")
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(customOAuth2UserService)
                    )
            );

    return http.build();
  }
}