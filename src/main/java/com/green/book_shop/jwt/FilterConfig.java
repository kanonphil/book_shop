package com.green.book_shop.jwt;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// 정의한 필터를 어떻게 사용할 지 설정하는 클래스
@Configuration // 객체 생성 + 이 클래스는 설정내용이 있다라는 것을 인지시켜 줌.
public class FilterConfig {

  @Bean // 객체 생성, 메서드 실행 결과 리턴되는 데이터를 객체로 생성
  public FilterRegistrationBean<Filter1> filterRegistrationBean() {
    FilterRegistrationBean<Filter1> registrationBean = new FilterRegistrationBean<>();

    // Filter1 검문소 생성
    registrationBean.setFilter(new Filter1());
    // 검문서 적용 Url 지정
    registrationBean.addUrlPatterns("/*");
    // 실행 순서 (숫자가 작을수록 먼저 실행)
    registrationBean.setOrder(0);

    return registrationBean;
  }

  @Bean
  public FilterRegistrationBean<Filter2> filterRegistrationBean2() {
    FilterRegistrationBean<Filter2> registrationBean = new FilterRegistrationBean<>();

    registrationBean.setFilter(new Filter2());
    registrationBean.addUrlPatterns("/*");
    registrationBean.setOrder(1);

    return registrationBean;
  }
}
