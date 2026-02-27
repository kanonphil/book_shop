package com.green.book_shop.buy.service;

import com.green.book_shop.buy.dto.BuyHistoryDTO;
import com.green.book_shop.buy.dto.BuyHistoryRequestDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import com.green.book_shop.buy.mapper.BuyManageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuyManageServiceImpl implements BuyManageService {
  private final BuyManageMapper buyManageMapper;

  @Override
  public List<BuyHistoryDTO> getBuyHistory(BuyHistoryRequestDTO request) {
    log.info("구매내역 조회 - memEmail: {}, startDate: {}, endDate: {}, bookTitle: {}",
            request.getMemEmail(), request.getStartDate(),
            request.getEndDate(), request.getBookTitle());

    return buyManageMapper.selectBuyHistory(request);
  }

  @Override
  public List<SalesDTO> getMonthlySales(int year) {
    log.info("월별 매출 조회 - year: {}", year);
    return buyManageMapper.selectMonthlySales(year);
  }

  @Override
  public List<SalesDTO> getWeeklySales(int year, int month) {
    log.info("주간 매출 조회 - year: {}, month: {}", year, month);
    return buyManageMapper.selectWeeklySales(year, month);
  }
}
