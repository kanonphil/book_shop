package com.green.book_shop.buy.mapper;

import com.green.book_shop.buy.dto.BuyHistoryDTO;
import com.green.book_shop.buy.dto.BuyHistoryRequestDTO;
import com.green.book_shop.buy.dto.SalesDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BuyManageMapper {
  // 전체 구매내역 조회 (필터 조건)
  List<BuyHistoryDTO> selectBuyHistory(BuyHistoryRequestDTO request);

  // 월별 매출 조회
  List<SalesDTO> selectMonthlySales(@Param("year") int year);

  // 주간 매출 조회
  List<SalesDTO> selectWeeklySales(@Param("year") int year, @Param("month") int month);
}
