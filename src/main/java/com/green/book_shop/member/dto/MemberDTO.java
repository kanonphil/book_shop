package com.green.book_shop.member.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
  private String memEmail;
  private String memPw;
  private String memName;
  private String memTel;
  private String memAddr;
  private String addrDetail;
  private String isUsing;
  private String memRole;
  private LocalDateTime joinDate;
}
