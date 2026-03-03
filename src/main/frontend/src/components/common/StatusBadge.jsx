import React from 'react'
import styles from './StatusBadge.module.css'

const StatusBadge = ({ type, value }) => {

  const getBadgeConfig = () => {
    switch (type) {
      // ── 계정 활성 상태 ──────────────────────────────────
      case 'status':
        return value === 'Y'
          ? { colorClass: styles.green, label: '활성' }
          : { colorClass: styles.red, label: '비활성' }
    
      // ── 회원 권한 ───────────────────────────────────────
      case 'role':
        if (value === 'ADMIN') return { colorClass: styles.red, label: 'ADMIN' }
        if (value === 'MANAGER') return { colorClass: styles.orange, label: 'MANAGER' }
        return { colorClass: styles.blue, label: 'USER' }

      // ── 가입 방식 ───────────────────────────────────────
      case 'provider':
        if (value === 'google') return { colorClass: styles.google, label: 'Google' }
        if (value === 'naver') return { colorClass: styles.naver, label: 'Naver' }
        return { colorClass: styles.gray, label: '일반' }
      
      // ── 기본값 ──────────────────────────────────────────
      default:
        return { colorClass: styles.gray, label: value ?? '-'}
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