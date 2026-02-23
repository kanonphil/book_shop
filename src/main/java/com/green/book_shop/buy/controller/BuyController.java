package com.green.book_shop.buy.controller;

import com.green.book_shop.buy.dto.BuyDTO;
import com.green.book_shop.buy.dto.BuyRequestDTO;
import com.green.book_shop.buy.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/buy-list")
@RequiredArgsConstructor
public class BuyController {
  private final BuyService buyService;

  /**
   * 주문 등록
   * POST /buy-list
   */
  @PostMapping
  public ResponseEntity<?> createBuy(
          @RequestBody BuyRequestDTO request,
          @AuthenticationPrincipal UserDetails userDetails
          ) {
    String memEmail = userDetails.getUsername();
    buyService.createBuy(request, memEmail);
    return ResponseEntity.ok(Map.of("success", true, "message", "주문이 완료되었습니다."));
  }

  /**
   * 내 주문 목록 조회
   * GET /buy-list
   */
  @GetMapping
  public ResponseEntity<?> getBuyList(
          @AuthenticationPrincipal UserDetails userDetails
  ) {
    String memEmail = userDetails.getUsername();
    List<BuyDTO> buyList = buyService.getBuyList(memEmail);
    return ResponseEntity.ok(Map.of("success", true, "buyList", buyList));
  }

  /**
   * 주문 단건 조회
   * GET /buy-list/{buyNum}
   */
  @GetMapping("/{buyNum}")
  public ResponseEntity<?> getBuyByNum(
          @PathVariable int buyNum,
          @AuthenticationPrincipal UserDetails userDetails
  ) {
    String memEmail = userDetails.getUsername();
    BuyDTO buy = buyService.getBuyByNum(buyNum, memEmail);
    return ResponseEntity.ok(Map.of("success", true, "buy", buy));
  }
}
