package com.green.book_shop.config;

import com.green.book_shop.filter.LoginFilter;
import com.green.book_shop.jwt.JwtConfirmFilter;
import com.green.book_shop.jwt.JwtUtil;
import com.green.book_shop.member.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {
  private final JwtUtil jwtUtil;

//  private final CustomOAuth2UserService customOAuth2UserService;
//  private final OAuth2SuccessHandler oAuth2SuccessHandler;
//
//  public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
//                        OAuth2SuccessHandler oAuth2SuccessHandler) {
//    this.customOAuth2UserService = customOAuth2UserService;
//    this.oAuth2SuccessHandler = oAuth2SuccessHandler;
//  }

  /**
   * Spring Security에서 HTTP 요청에 대한 보안 설정을 정의하는 메서드
   * 메서드의 형태가 정해져 있음.
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationConfiguration authConfig) throws Exception {
    // 로그인 검증을 처리하는 객체를 의존성 주입으로 받아옴
    AuthenticationManager authenticationManager = authConfig.getAuthenticationManager();

    http
            // CORS 설정. 아래 corsConfigurationSource() 메서드에서 정의한 Bean을 등록함.
            .cors(Customizer.withDefaults())
            // csrf disable   세션방식이 아니기 때문에 할 필요 없음
            .csrf(csrf -> csrf.disable())
            // form 로그인 방식 disable
            .formLogin(form -> form.disable())
            // http basic 인증 방식 disable
            .httpBasic(basic -> basic.disable())
            // 세션을 STATELESS로 지정
            .sessionManagement(
                    session ->
                            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // 인증 및 인가에 대한 접근 설정
            .authorizeHttpRequests(auth ->
                    auth.requestMatchers("/test1").authenticated()
                            .requestMatchers("/admin/**").hasRole("ADMIN")
                            .requestMatchers("/manage/**").hasAnyRole("MANAGER", "ADMIN")
                            .anyRequest().permitAll() // 위 요청을 제외한 나머지 요청은 누구나 접근 가능
            );
//            .oauth2Login(oauth -> oauth
//                    .successHandler(oAuth2SuccessHandler)  // 핸들러 추가
//                    .failureUrl("http://localhost:5173/login-select?error=true")
//                    .userInfoEndpoint(userInfo -> userInfo
//                            .userService(customOAuth2UserService)
//                    )
//            );

    // 로그인 프로세스를 진행하는 LoginFilter 클래스를 SecurityFilterChain에 추가
    http.addFilterAt(new LoginFilter(authenticationManager, jwtUtil), UsernamePasswordAuthenticationFilter.class);

    // 모든 요청에서 토큰을 검증하는 JwtConfirmFilter 클래스를 SecurityFilterChain에 추가
    // JwtConfirmFilter 클래스는 LoginFilter가 진행되기 전에 실행되도록 설정 함
    http.addFilterBefore(new JwtConfirmFilter(jwtUtil), LoginFilter.class);

    return http.build();
  }

  // CORS 설정 Bean
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);   // 쿠키 정보를 통신하기 위한 설정
    config.addAllowedOrigin("http://localhost:5173");   // react에서의 요청 허용
    config.addAllowedHeader("*");   // 모든 헤더 정보 허용
    config.addAllowedMethod("*");   // get, post, delete, put 등의 요청 메서드 허용

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  // 비밀번호 암호화 기능을 제공하는 객체
  @Bean
  public PasswordEncoder bCryptPasswordEncoder() {
    return new BCryptPasswordEncoder();
  }
}