package com.green.book_shop.jwt;

import jakarta.servlet.*;

import java.io.IOException;

public class Filter2 implements Filter {
  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    System.out.println("Filter2 클래스의 doFilter 메서드 실행");
    filterChain.doFilter(servletRequest, servletResponse);
  }
}
