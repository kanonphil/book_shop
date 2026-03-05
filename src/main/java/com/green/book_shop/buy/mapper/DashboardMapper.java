package com.green.book_shop.buy.mapper;

import com.green.book_shop.buy.dto.BookRankDTO;
import com.green.book_shop.buy.dto.BuyRankDTO;
import com.green.book_shop.buy.dto.DashboardStatsDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DashboardMapper {
  // 오늘/이달 주문건수 매출 통계
  DashboardStatsDTO selectDashboardStats();

  // 최근 10일간 일별 매출 (AreaChart등)
  List<SalesDTO> selectRecentDailySales();

  // 구매 랭킹 상위 5명
  List<BuyRankDTO> selectBuyRank();

  // 인기 도서 랭킹 상위 5권
  List<BookRankDTO> selectBookRank();
}
