package com.green.book_shop.buy.service;

import com.green.book_shop.buy.dto.BookRankDTO;
import com.green.book_shop.buy.dto.BuyRankDTO;
import com.green.book_shop.buy.dto.DashboardStatsDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import com.green.book_shop.buy.mapper.DashboardMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {
  private final DashboardMapper dashboardMapper;

  @Override
  public DashboardStatsDTO getDashboardStats() {
    log.info("대시보드 통계 조회");
    return dashboardMapper.selectDashboardStats();
  }

  @Override
  public List<SalesDTO> getRecentDailySales() {
    log.info("최근 10일 매출 조회");
    return dashboardMapper.selectRecentDailySales();
  }

  @Override
  public List<BuyRankDTO> getBuyRank() {
    log.info("구매 랭킹 조회");
    return dashboardMapper.selectBuyRank();
  }

  @Override
  public List<BookRankDTO> getBookRank() {
    log.info("인기 도서 랭킹 조회");
    return dashboardMapper.selectBookRank();
  }
}
