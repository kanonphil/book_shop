package com.green.book_shop.jwt;

import jakarta.servlet.*;

import java.io.IOException;

// 디스패쳐서블릿에 요청이 들어오기 전 실행할 검문서 정의
// Dispatcher Servlet
// Filter 인터페이스를 구현하는 클래스는 필터 역할을 수행
// Filter 인터페이스에 선언된 doFilter() 메서드에 필터 시 적용할 코드를 작성
public class Filter1 implements Filter {
  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    System.out.println("Filter1 클래스의 doFilter 메서드 실행");
    filterChain.doFilter(servletRequest, servletResponse);
  }
}
