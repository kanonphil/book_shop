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
  
  // 입력한 값 변경 핸들러
  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    })
    // 에러 초기화
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  // 유효성 검사
  const validate = () => {
    const newErrors = {}

    if (!formData.memEmail) {
      newErrors.memEmail = '이메일을 입력하세요'
    } else if (!/\S+@\S+\.\S+/.test(formData.memEmail)) {
      newErrors.memEmail = '올바른 이메일 형식이 아닙니다'
    }

    if (!formData.memPw) {
      newErrors.memPw = '비밀번호를 입력하세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 유효성 검사
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
        // 로그인 성공
        const member = response.data.member

        login(member)

        alert(`환영합니다, ${member.memName}님!`)

        // 권한에 따라 다른 페이지로 이동
        if (member.memRole === 'ADMIN' || member.memRole === 'MANAGER') {
          navigate('/manage') // 관리자 페이지
        } else {
          navigate('/') // 메인 페이지
        }
      }
    } catch (error) {
      // 에러 메시지 표시
      const message = error.response?.data?.message || '로그인에 실패했습니다'
      alert(message)
      
      // 비밀번호 초기화
      setFormData({
        ...formData,
        password: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <FormContainer title='로그인' onSubmit={handleSubmit}>
        {/* Email */}
        <div className={styles.field_wrapper}>
          <Input 
            label="Email"
            type="email"
            placeholder="Input Your I.D"
            value={formData.memEmail}
            onChange={handleChange('memEmail')}
          />
          {errors.memEmail && <p className={styles.error}>{errors.memEmail}</p>}
        </div>
  
        {/* Password */}
        <div className={styles.field_wrapper}>
          <Input 
            label='Password'
            type='password'
            placeholder="Input Your Password"
            value={formData.memPw}
            onChange={handleChange('memPw')}
          />
          {errors.memPw && <p className={styles.error}>{errors.memPw}</p>}
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
        
        {/* 회원가입 항목 */}
        <div className={styles.links}>
          <span onClick={() => navigate('/login-select')}>← 다른 방법으로 로그인</span>
          <span className={styles.divider}>|</span>
          <span onClick={() => navigate('/join')}>회원가입</span>
        </div>
      </FormContainer>
    </>
  )
}

export default Login