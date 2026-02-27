package com.green.book_shop.buy.service;

import com.green.book_shop.buy.dto.BuyHistoryDTO;
import com.green.book_shop.buy.dto.BuyHistoryRequestDTO;
import com.green.book_shop.buy.dto.SalesDTO;

import java.util.List;

public interface BuyManageService {
  // 전체 구매내역 조회
  List<BuyHistoryDTO> getBuyHistory(BuyHistoryRequestDTO request);

  // 월별 매출 조회
  List<SalesDTO> getMonthlySales(int year);

  // 주간 매출 조회
  List<SalesDTO> getWeeklySales(int year, int month);
}
