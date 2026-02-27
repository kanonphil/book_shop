package com.green.book_shop.buy.controller;

import com.green.book_shop.buy.dto.BuyHistoryDTO;
import com.green.book_shop.buy.dto.BuyHistoryRequestDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import com.green.book_shop.buy.service.BuyManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manage/buy")
@RequiredArgsConstructor
@Slf4j
public class BuyManageController {
  private final BuyManageService buyManageService;

  /**
   * 전체 구매내역 조회
   * GET /manage/buy/history
   */
  @GetMapping("/history")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> getBuyHistory(BuyHistoryRequestDTO request) {
    List<BuyHistoryDTO> buyHistory = buyManageService.getBuyHistory(request);
    return ResponseEntity.ok(Map.of(
            "success", true,
            "buyHistory", buyHistory
    ));
  }

  /**
   * 월별 매출 조회
   * GET /manage/buy/monthly?year=2026
   */
  @GetMapping("/monthly")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> getMonthlySales(@RequestParam int year) {
    List<SalesDTO> monthlySales = buyManageService.getMonthlySales(year);
    return ResponseEntity.ok(Map.of(
            "success", true,
            "monthlySales", monthlySales
    ));
  }

  /**
   * 주간 매출 조회
   * GET /manage/buy/weekly?year=2026&month=2
   */
  @GetMapping("/weekly")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> getWeeklySales(@RequestParam int year,
                                          @RequestParam int month) {
    List<SalesDTO> weeklySales = buyManageService.getWeeklySales(year, month);
    return ResponseEntity.ok(Map.of(
            "success", true,
            "weeklySales", weeklySales
    ));
  }
}
