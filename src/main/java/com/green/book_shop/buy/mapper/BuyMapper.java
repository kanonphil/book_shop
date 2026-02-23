package com.green.book_shop.buy.mapper;

import com.green.book_shop.buy.dto.BuyDTO;
import com.green.book_shop.buy.dto.BuyDetailDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BuyMapper {
  void insertBuy(BuyDTO buyDTO);
  void insertBuyDetail(BuyDetailDTO buyDetailDTO);
  List<BuyDTO> selectBuyList(String memEmail);
  BuyDTO selectBuyByNum(int buyNum);
  int selectBookStockByNum(int bookNum);
}
