import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import FormContainer from '../../components/common/Form'
import { loginMember } from '../../api/memberApi'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    memEmail: '',
    memPw: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validated, setValidated] = useState({
    memEmail: false,
    memPw: false
  })

  // 정규식 (Join과 동일)
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,50}$/
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/

  // 필드별 유효성 검사 함수
  const validateField = (field, value) => {
    switch (field) {
      case 'memEmail':
        if (!value) return '이메일을 입력하세요'
        if (!emailRegEx.test(value)) return '올바른 이메일 형식이 아닙니다'
        return ''

      case 'memPw':
        if (!value) return '비밀번호를 입력하세요'
        if (!passwordRegEx.test(value)) return '비밀번호는 영문 대소문자, 숫자를 혼합하여 4~12자로 입력해주세요'
        return ''

      default:
        return ''
    }
  }
  
  // 입력한 값 변경 핸들러
  const handleChange = (field) => (e) => {
    const value = e.target.value

    setFormData({
      ...formData,
      [field]: value
    })

    // 실시간 유효성 검사
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))

    // 성공 상태 업데이트
    setValidated(prev => ({
      ...prev,
      [field]: !error && value !== ''
    }))
  }

  // 전체 유효성 검사
  const validate = () => {
    const newErrors = {}

    newErrors.memEmail = validateField('memEmail', formData.memEmail)
    newErrors.memPw = validateField('memPw', formData.memPw)

    // 빈 문자열 제거
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await loginMember({
        memEmail: formData.memEmail,
        memPw: formData.memPw
      })

      if (response.data.success) {
        const member = response.data.member
        login(member)
        alert(`환영합니다, ${member.memName}님!`)

        if (member.memRole === 'ADMIN' || member.memRole === 'MANAGER') {
          navigate('/manage')
        } else {
          navigate('/')
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || '로그인에 실패했습니다'
      alert(message)
      
      // 비밀번호 초기화
      setFormData({
        ...formData,
        memPw: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer title='로그인' onSubmit={handleSubmit}>
      {/* Email */}
      <div className={styles.field_wrapper}>
        <Input 
          label="Email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={formData.memEmail}
          onChange={handleChange('memEmail')}
        />
        {errors.memEmail && <p className={styles.error}>{errors.memEmail}</p>}
        {validated.memEmail && <p className={styles.success}>✓ 올바른 이메일 형식입니다</p>}
      </div>

      {/* Password */}
      <div className={styles.field_wrapper}>
        <Input 
          label='Password'
          type='password'
          placeholder="비밀번호를 입력하세요"
          value={formData.memPw}
          onChange={handleChange('memPw')}
        />
        {errors.memPw && <p className={styles.error}>{errors.memPw}</p>}
        {validated.memPw && <p className={styles.success}>✓ 올바른 비밀번호 형식입니다</p>}
      </div>

      {/* Submit Button */}
      <div className={styles.button_group}>
        <Button 
          variant='dark'
          fullWidth={true}
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </div>
      
      {/* 링크 */}
      <div className={styles.links}>
        <span onClick={() => navigate('/login-select')}>← 다른 방법으로 로그인</span>
        <span className={styles.divider}> | </span>
        <span onClick={() => navigate('/join')}>회원가입</span>
      </div>
    </FormContainer>
  )
}

export default Login