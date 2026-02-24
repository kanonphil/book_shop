package com.green.book_shop.buy.service;

import com.green.book_shop.book.dto.BookDTO;
import com.green.book_shop.book.mapper.BookMapper;
import com.green.book_shop.buy.dto.BuyDTO;
import com.green.book_shop.buy.dto.BuyDetailDTO;
import com.green.book_shop.buy.dto.BuyRequestDTO;
import com.green.book_shop.buy.mapper.BuyMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuyServiceImpl implements BuyService {
  private final BuyMapper buyMapper;
  private final BookMapper bookMapper;  // 재고 검증

  /**
   * 주문 등록
   * 1. 재고 검증
   * 2. SHOP_BUY 헤더 삽입 (buyNum 생성)
   * 3. BUY_DETAIL 상세 삽입
   */
  @Override
  @Transactional
  public void createBuy(BuyRequestDTO request, String memEmail) {
    // 1. 재고 검증
    for (BuyRequestDTO.BuyDetailDTO detail : request.getDetails()) {
      int bookStock = buyMapper.selectBookStockByNum(detail.getBookNum());

      // 확인용 로그
      log.info("bookNum: {}, bookStock: {}, buyCnt: {}",
              detail.getBookNum(), bookStock, detail.getBuyCnt());

      if (bookStock < detail.getBuyCnt()) {
        throw new RuntimeException("재고가 부족합니다.");
      }
    }

    // 2. SHOP_BUY 헤더 삽입
    BuyDTO buy = BuyDTO.builder()
            .buyPrice(request.getBuyPrice())
            .memEmail(memEmail)
            .build();

    buyMapper.insertBuy(buy);

    // 3. 주문 상세 삽입 + 재고 차감
    for (BuyRequestDTO.BuyDetailDTO detail : request.getDetails()) {
      BuyDetailDTO buyDetail = BuyDetailDTO.builder()
              .bookNum(detail.getBookNum())
              .buyCnt(detail.getBuyCnt())
              .buyPrice(detail.getBuyPrice())
              .buyNum(buy.getBuyNum())
              .build();

      buyMapper.insertBuyDetail(buyDetail);

      // 재고 차감
      bookMapper.deductBookStock(detail.getBookNum(), detail.getBuyCnt());
    }
  }

  /**
   *  내 주문 목록 조회
   */
  @Override
  public List<BuyDTO> getBuyList(String memEmail) {
    return buyMapper.selectBuyList(memEmail);
  }

  /**
   * 주문 단건 조회
   * 본인 주문인지 검증
   */
  @Override
  public BuyDTO getBuyByNum(int buyNum, String memEmail) {
    BuyDTO buy = buyMapper.selectBuyByNum(buyNum);

    if (buy == null) {
      throw new RuntimeException("존재하지 않는 주문입니다.");
    }

    // 본인 주문인지 확인
    if (!buy.getMemEmail().equals(memEmail)) {
      throw new RuntimeException("접근 권한이 없습니다.");
    }

    return buy;
  }
}
