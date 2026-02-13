package com.green.book_shop.cart.service;

import com.green.book_shop.cart.dto.CartDTO;
import com.green.book_shop.cart.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {
  private final CartMapper cartMapper;

  // 장바구니 목록 조회
  public List<CartDTO> getCartList(String memEmail) {
    return cartMapper.selectCartList(memEmail);
  }

  // 장바구니 추가
  @Transactional
  public void addToCart(CartDTO cartDTO) {
    // 이미 장바구니에 있는지 확인
    CartDTO existingCart = cartMapper.selectCartByBookNum(
            cartDTO.getMemEmail(),
            cartDTO.getBookNum()
    );

    if (existingCart != null) {
      // 이미 있으면 수량만 증가
      int newCnt = existingCart.getCartCnt() + cartDTO.getCartCnt();
      cartMapper.updateCartCnt(existingCart.getCartNum(), newCnt);
      log.info("장바구니 수량 증가 - cartNum: {}, 새 수량: {}", existingCart.getCartNum(), newCnt);
    } else {
      // 없으면 새로 추가
      cartMapper.insertCart(cartDTO);
      log.info("장바구니 추가 - bookNum: {}, 수량: {}", cartDTO.getBookNum(), cartDTO.getCartCnt());
    }
  }

  // 수량 변경
  public void updateCartCnt(Integer cartNum, Integer cartCnt) {
    if (cartCnt < 1) {
      throw new RuntimeException("수량은 1개 이상이어야 합니다.");
    }

    int result = cartMapper.updateCartCnt(cartNum, cartCnt);

    if (result == 0) {
      throw new RuntimeException("장바구니 항목을 찾을 수 없습니다.");
    }

    log.info("장바구니 수량 변경 - cartNum: {}, 새 수량: {}", cartNum, cartCnt);
  }

  // 단일 삭제
  public void deleteCart(Integer cartNum) {
    int result = cartMapper.deleteCart(cartNum);

    if (result == 0) {
      throw new RuntimeException("장바구니 항목을 찾을 수 없습니다.");
    }

    log.info("장바구니 삭제 - cartNum: {}", cartNum);
  }

  // 선택 삭제
  @Transactional
  public void deleteCartList(List<Integer> cartNumList) {
    if (cartNumList == null || cartNumList.isEmpty()) {
      throw new RuntimeException("삭제할 항목을 선택해주세요.");
    }

    cartMapper.deleteCartList(cartNumList);
    log.info("장바구니 선택 삭제 - 개수: {}", cartNumList.size());
  }

  // 총 가격 계산
  public Integer getTotalPrice(String memEmail) {
    Integer totalPrice = cartMapper.selectTotalPrice(memEmail);
    return totalPrice != null ? totalPrice : 0;
  }
}
