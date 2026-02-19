package com.green.book_shop.cart.mapper;

import com.green.book_shop.cart.dto.CartDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {
  // 장바구니 목록 조회
  List<CartDTO> selectCartList(@Param("memEmail") String memEmail);

  // 장바구니 추가
  int insertCart(CartDTO cartDTO);

  // 수량 변경
  int updateCartCnt(@Param("cartNum") Integer cartNum, @Param("cartCnt") Integer cartCnt);

  // 단일 삭제
  int deleteCart(@Param("cartNum") Integer cartNum);

  // 선택 삭제
  int deleteCartList(@Param("cartNumList") List<Integer> cartNumList);

  // 중복 체크
  CartDTO selectCartByBookNum(@Param("memEmail") String memEmail, @Param("bookNum") Integer bookNum);

  // 총 가격 계산
  Integer selectTotalPrice(@Param("memEmail") String memEmail);
}
