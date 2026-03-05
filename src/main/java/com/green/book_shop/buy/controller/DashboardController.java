package com.green.book_shop.buy.controller;

import com.green.book_shop.buy.dto.BookRankDTO;
import com.green.book_shop.buy.dto.BuyRankDTO;
import com.green.book_shop.buy.dto.DashboardStatsDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import com.green.book_shop.buy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manage/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {
  private final DashboardService dashboardService;

  /**
   * 대시보드 전체 데이터 조회
   * GET /manage/dashboard
   */
  @GetMapping("")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> getDashboard() {
    try {
      DashboardStatsDTO stats = dashboardService.getDashboardStats();
      List<SalesDTO> recentSales = dashboardService.getRecentDailySales();
      List<BuyRankDTO> buyRank = dashboardService.getBuyRank();
      List<BookRankDTO> bookRank = dashboardService.getBookRank();

      return ResponseEntity.ok(Map.of(
              "success", true,
              "stats", stats,
              "recentSales", recentSales,
              "buyRank", buyRank,
              "bookRank", bookRank
      ));
    } catch (Exception e) {
      log.error("대시보드 조회 실패: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
              "success", false,
              "message", e.getMessage()
      ));
    }
  }
}
