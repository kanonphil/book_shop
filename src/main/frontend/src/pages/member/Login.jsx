import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginReducer } from '../../redux/authSlice'
import styles from './Login.module.css'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Form from '../../components/common/Form'
import { loginMember } from '../../api/memberApi'
// import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { login } = useAuth()

  const [formData, setFormData] = useState({
    memEmail: '',
    memPw: '',
    rememberMe: false
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validated, setValidated] = useState({
    memEmail: false,
    memPw: false
  })

  // 정규식
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,50}$/

  // 필드별 유효성 검사 함수
  const validateField = (field, value) => {
    switch (field) {
      case 'memEmail':
        if (!value) return 'ID를 입력하세요'
        if (!emailRegEx.test(value)) return '올바른 이메일 형식이 아닙니다'
        return ''

      case 'memPw':
        if (!value) return 'PW를 입력하세요'
        return ''

      default:
        return ''
    }
  }

  // 초기 에러 상태 설정
  useEffect(() => {
    setErrors({
      memEmail: 'ID를 입력하세요',
      memPw: 'PW를 입력하세요'
    })
  }, [])
  
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
        const token = response.data.token  // 토큰 추출

        if (token) {
          if (formData.rememberMe) {
            // 체크 시: localStorage 사용
            localStorage.setItem('accessToken', token)
            localStorage.setItem('userInfo', JSON.stringify(member))
            localStorage.setItem('rememberMe', 'true')  // 플래그 저장
          } else {
            // 미체크 시: sessionStorage 사용
            sessionStorage.setItem('accessToken', token)
            sessionStorage.setItem('userInfo', JSON.stringify(member))
            localStorage.removeItem('rememberMe')  // 플래그 제거
          }
        }

        // Redux에 토큰과 사용자 정보 함께 저장
        dispatch(loginReducer({ token, member }))

        alert(`환영합니다, ${member.memName}님!`)

        // 권한에 따른 페이지 이동
        if (member.memRole === 'ADMIN' || member.memRole === 'MANAGER') {
          navigate('/manage')
        } else {
          navigate('/')
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || '로그인에 실패했습니다'
      
      // 이메일과 비밀번호 둘 다 에러 표시
      setErrors({
        memEmail: message,
        memPw: message
      })

      // validated 둘 다 초기화
      setValidated({
        memEmail: false,
        memPw: false
      })
      
      // 비밀번호 초기화
      setFormData({
        ...formData,
        memPw: ''
      })

      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form title='로그인' onSubmit={handleSubmit}>
      {/* Email */}
      <Input 
        label="Email"
        type="email"
        name="memEmail"
        placeholder="Input Your ID"
        value={formData.memEmail}
        onChange={handleChange('memEmail')}
        error={errors.memEmail}
        required
      />
      {validated.memEmail && <p className={styles.success}>✓ 올바른 이메일 형식입니다</p>}

      {/* Password */}
      <Input 
        label='Password'
        type='password'
        name="memPw"
        placeholder="Input Your Password"
        value={formData.memPw}
        onChange={handleChange('memPw')}
        error={errors.memPw}
        required
      />

      {/* 로그인 상태 유지 체크박스 */}
      <div className={styles.checkboxContainer}>
        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox"
            className={styles.checkboxInput}
            checked={formData.rememberMe}
            onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
          />
          <span className={styles.checkboxCustom}></span>
          <span className={styles.checkboxText}>로그인 상태 유지</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className={styles.buttonGroup}>
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
    </Form>
  )
}

export default Login