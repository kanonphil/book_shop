package com.green.book_shop.buy.service;

import com.green.book_shop.buy.dto.BuyDTO;
import com.green.book_shop.buy.dto.BuyRequestDTO;

import java.util.List;

public interface BuyService {
  // 주문 등록
  void createBuy(BuyRequestDTO request, String memEmail);

  // 내 주문 목록 조회
  List<BuyDTO> getBuyList(String memEmail);

  // 주문 단건 조회
  BuyDTO getBuyByNum(int buyNum, String memEmail);
}
