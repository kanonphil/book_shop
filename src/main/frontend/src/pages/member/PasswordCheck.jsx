import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkPassword } from '../../api/memberApi'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import styles from './PasswordCheck.module.css'

const PasswordCheck = () => {
  const navigate = useNavigate()
  const { member } = useSelector(state => state.auth)

  const [memPw, setMemPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!memPw) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const res = await checkPassword(member.memEmail, memPw)
      if (res.success) {
        // 확인 성공 → 정보 수정 페이지로 이동
        // state로 verified 전달 → ProfileEdit에서 직접 접근 차단에 사용
        navigate('/mypage/profile-edit/form', { state: { verified: true } })
      } else {
        setError('비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      setError(error.message || '비밀번호 확인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>본인 확인</h2>
        <p className={styles.desc}>
          개인정보 보호를 위해 비밀번호를 입력해주세요.
        </p>

        <Input
          label='Password'
          type='password'
          name='memPw'
          value={memPw}
          onChange={(e) => {
            setMemPw(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder='비밀번호를 입력하세요'
          error={error}
        />

        <div className={styles.buttonGroup}>
          <Button
            variant='secondary'
            onClick={() => navigate('/mypage')}
          >
            취소
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '확인 중...' : '확인'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PasswordCheck