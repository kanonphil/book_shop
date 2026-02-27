package com.green.book_shop.cart.controller;

import com.green.book_shop.cart.dto.CartDTO;
import com.green.book_shop.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carts")
@Slf4j
public class CartController {
  private final CartService cartService;

  /**
   * 장바구니 목록 조회
   * GET /carts
   */
  @GetMapping("")
  public ResponseEntity<?> getCartList(Authentication auth) {
    try {
      // 로그인한 사용자 이메일 가져오기
      String memEmail = auth.getName();
      log.info("장바구니 조회 - 사용자: {}", memEmail);

      List<CartDTO> cartList = cartService.getCartList(memEmail);
      Integer totalPrice = cartService.getTotalPrice(memEmail);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("cartList", cartList);
      result.put("totalPrice", totalPrice);

      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("장바구니 조회 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "장바구니 조회를 실패했습니다: " + e.getMessage());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  /**
   * 장바구니 추가
   * POST /carts
   */
  @PostMapping("")
  public ResponseEntity<?> addToCart(@RequestBody CartDTO cartDTO,
                                     Authentication auth) {
    try {
      String memEmail = auth.getName();
      cartDTO.setMemEmail(memEmail);

      log.info("장바구니 추가 - 사용자: {}, 상품번호: {}, 수량: {}",
              memEmail, cartDTO.getBookNum(), cartDTO.getCartCnt());

      cartService.addToCart(cartDTO);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "장바구니에 추가되었습니다.");

      return ResponseEntity.status(HttpStatus.CREATED).body(result);
    } catch (Exception e) {
      log.error("장바구니 추가 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "장바구니 추가에 실패했습니다: " + e.getMessage());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  /**
   * 수량 변경
   * PUT /carts/{cartNum}
   */
  @PutMapping("/{cartNum}")
  public ResponseEntity<?> updateCartCnt(@PathVariable Integer cartNum,
                                         @RequestBody Map<String, Integer> request) {
    try {
      Integer cartCnt = request.get("cartCnt");

      if (cartCnt == null || cartCnt < 1) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "올바른 수량을 입력해주세요."));
      }

      log.info("=== 수량 변경 요청 ===");
      log.info("장바구니 수량 변경 - cartNum: {}, 새 수량: {}", cartNum, cartCnt);

      cartService.updateCartCnt(cartNum, cartCnt);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "수량이 변경되었습니다.");

      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("수량 변경 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", e.getMessage());

      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * 장바구니 삭제 (단일)
   * DELETE /carts/{cartNum}
   */
  @DeleteMapping("/{cartNum}")
  public ResponseEntity<?> deleteCart (@PathVariable Integer cartNum) {
    try {
      log.info("장바구니 삭제 - cartNum: {}", cartNum);

      cartService.deleteCart(cartNum);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "장바구니에서 삭제되었습니다.");

      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.info("삭제 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", e.getMessage());

      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * 장바구니 선택 삭제
   * DELETE /carts
   */
  @DeleteMapping("")
  public ResponseEntity<?> deleteCartList (@RequestBody Map<String, List<Integer>> request) {
    try {
      List<Integer> cartNumList = request.get("cartNumList");

      log.info("장바구니 선택 삭제 - 개수: {}", cartNumList.size());

      cartService.deleteCartList(cartNumList);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "선택한 상품이 삭제되었습니다.");

      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("선택 삭제 실패", e);

      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", e.getMessage());

      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }
}
