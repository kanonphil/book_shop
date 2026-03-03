import React from 'react'
import styles from './StatusBadge.module.css'

/**
 * StatusBadge - 상태/권한/가입방식을 시각적으로 표현하는 공통 뱃지 컴포넌트
 *
 * 회원 관리 페이지에서 아래 3가지 용도로 활용:
 *  1. 계정 상태 (isUsing): 활성(초록) / 비활성(빨강)
 *  2. 회원 권한 (memRole): USER(파랑) / MANAGER(주황) / ADMIN(빨강)
 *  3. 가입 방식 (provider): local(회색) / google(초록) / naver(초록)
 *
 * 사용 예:
 *   <StatusBadge type="status" value="Y" />       → "활성" (초록 뱃지)
 *   <StatusBadge type="role" value="MANAGER" />   → "MANAGER" (주황 뱃지)
 *   <StatusBadge type="provider" value="google" /> → "google" (초록 뱃지)
 *
 * @param {'status' | 'role' | 'provider'} type  - 뱃지 종류
 * @param {string} value                          - 표시할 값
 */
const StatusBadge = ({ type, value }) => {

  /**
   * type과 value에 따라 CSS 클래스와 표시 텍스트 결정
   * @returns {{ colorClass: string, label: string }}
   */
  const getBadgeConfig = () => {
    switch (type) {
      // ── 계정 활성 상태 ──────────────────────────────────
      case 'status':
        return value === 'Y'
          ? { colorClass: styles.green, label: '활성' }
          : { colorClass: styles.red,   label: '비활성' }

      // ── 회원 권한 ────────────────────────────────────────
      case 'role':
        if (value === 'ADMIN')   return { colorClass: styles.red,    label: 'ADMIN' }
        if (value === 'MANAGER') return { colorClass: styles.orange,  label: 'MANAGER' }
        return                          { colorClass: styles.blue,    label: 'USER' }

      // ── 가입 방식 ────────────────────────────────────────
      case 'provider':
        if (value === 'google') return { colorClass: styles.google, label: 'Google' }
        if (value === 'naver')  return { colorClass: styles.naver,  label: 'Naver' }
        return                         { colorClass: styles.gray,   label: '일반' }

      // ── 기본값 ───────────────────────────────────────────
      default:
        return { colorClass: styles.gray, label: value ?? '-' }
    }
  }

  const { colorClass, label } = getBadgeConfig()

  return (
    <span className={`${styles.badge} ${colorClass}`}>
      {label}
    </span>
  )
}

export default StatusBadge
