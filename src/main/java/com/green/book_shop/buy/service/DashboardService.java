package com.green.book_shop.buy.service;

import com.green.book_shop.buy.dto.BookRankDTO;
import com.green.book_shop.buy.dto.BuyRankDTO;
import com.green.book_shop.buy.dto.DashboardStatsDTO;
import com.green.book_shop.buy.dto.SalesDTO;

import java.util.List;

public interface DashboardService {
  DashboardStatsDTO getDashboardStats();
  List<SalesDTO> getRecentDailySales();
  List<BuyRankDTO> getBuyRank();
  List<BookRankDTO> getBookRank();
}
