import React, { useState } from 'react'
import styles from './Join.module.css'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import TelInput from '../../components/common/TelInput'
import Button from '../../components/common/Button'
import AddressInput from '../../components/common/AddressInput'
import Form from '../../components/common/Form'
import { checkEmail, joinMember } from '../../api/memberApi'

const Join = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    memEmail: '',
    memPw: '',
    confirmPw: '',
    memName: '',
    memTel1: '010',
    memTel2: '',
    memTel3: '',
    memAddr: '',
    addrDetail: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  
  const [validated, setValidated] = useState({
    memEmail: false,
    memPw: false,
    confirmPw: false,
    memName: false,
    memTel: false,
    memAddr: false
  })

  // 정규식
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,50}$/
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/
  const nameRegEx = /^[가-힣a-zA-Z0-9]{2,20}$/
  const tel1RegEx = /^\d{3}$/
  const tel2RegEx = /^\d{4}$/
  const tel3RegEx = /^\d{4}$/

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

      case 'confirmPw':
        if (!value) return ''
        if (value !== formData.memPw) return '비밀번호가 일치하지 않습니다'
        return ''

      case 'memName':
        if (!value) return '이름을 입력하세요'
        if (!nameRegEx.test(value)) return '이름은 한글 또는 영문 2~20자로 입력해주세요'
        return ''

      case 'memTel1':
        if (!value) return '전화번호를 입력하세요'
        if (!tel1RegEx.test(value)) return '전화번호는 첫 자리는 숫자 3자리로 입력해주세요'
        return ''

      case 'memTel2':
        if (!value) return '전화번호를 입력하세요'
        if (!tel2RegEx.test(value)) return '전화번호는 숫자 4자리로 입력해주세요'
        return ''

      case 'memTel3':
        if (!value) return '전화번호를 입력하세요'
        if (!tel3RegEx.test(value)) return '전화번호는 숫자 4자리로 입력해주세요'
        return ''

      case 'memAddr':
        if (!value) return '주소를 입력하세요'
        return ''

      default:
        return ''
    }
  }

  // 입력값 변경 핸들러
  const handleChange = (field) => (e) => {
    const value = e.target.value

    setFormData({
      ...formData,
      [field]: value
    })

    // 이메일 변경 시 중복 확인 초기화
    if (field === 'memEmail') {
      setEmailVerified(false)
    }

    // 비밀번호 변경 시 confirmPw도 재검증
    if (field === 'memPw' && formData.confirmPw) {
      const confirmError = validateField('confirmPw', formData.confirmPw)
      setErrors(prev => ({ ...prev, confirmPw: confirmError }))
      setValidated(prev => ({ 
        ...prev, 
        confirmPw: !confirmError && formData.confirmPw !== '' 
      }))
    }

    // confirmPw 변경 시 일치 여부 확인
    if (field === 'confirmPw') {
      const confirmError = validateField('confirmPw', value)
      setValidated(prev => ({ 
        ...prev, 
        confirmPw: !confirmError && value !== '' 
      }))
    }

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

  // 전화번호 변경 핸들러
  const handleTelChange = (tel1, tel2, tel3) => {
    setFormData({
      ...formData,
      memTel1: tel1,
      memTel2: tel2,
      memTel3: tel3
    })

    // 전화번호 유효성 검사
    const tel1Error = validateField('memTel1', tel1)
    const tel2Error = validateField('memTel2', tel2)
    const tel3Error = validateField('memTel3', tel3)
    const telError = tel1Error || tel2Error || tel3Error

    setErrors(prev => ({
      ...prev,
      memTel: telError
    }))

    // 성공 상태 업데이트
    setValidated(prev => ({
      ...prev,
      memTel: !telError && tel1 !== '' && tel2 !== '' && tel3 !== ''
    }))
  }

  // 주소 변경 핸들러
  const handleAddressChange = (addr, detail) => {
    setFormData({
      ...formData,
      memAddr: addr,
      addrDetail: detail
    })

    // 주소 유효성 검사
    const error = validateField('memAddr', addr)
    setErrors(prev => ({
      ...prev,
      memAddr: error
    }))

    // 성공 상태 업데이트
    setValidated(prev => ({
      ...prev,
      memAddr: !error && addr !== ''
    }))
  }

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const emailError = validateField('memEmail', formData.memEmail)
    
    if (emailError) {
      alert(emailError)
      return
    }

    try {
      const response = await checkEmail(formData.memEmail)
      
      if (response.data.isDuplicate) {
        alert('이미 사용 중인 이메일입니다')
        setEmailVerified(false)
      } else {
        alert('사용 가능한 이메일입니다')
        setEmailVerified(true)
      }
    } catch (error) {
      console.error('이메일 확인 실패:', error)
      alert('이메일 확인 중 오류가 발생했습니다')
      setEmailVerified(false)
    }
  }

  // 전체 유효성 검사
  const validate = () => {
    const newErrors = {}

    newErrors.memEmail = validateField('memEmail', formData.memEmail)
    newErrors.memPw = validateField('memPw', formData.memPw)
    newErrors.confirmPw = validateField('confirmPw', formData.confirmPw)
    newErrors.memName = validateField('memName', formData.memName)
    
    const tel1Error = validateField('memTel1', formData.memTel1)
    const tel2Error = validateField('memTel2', formData.memTel2)
    const tel3Error = validateField('memTel3', formData.memTel3)
    newErrors.memTel = tel1Error || tel2Error || tel3Error

    newErrors.memAddr = validateField('memAddr', formData.memAddr)

    // 빈 문자열 제거
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const memTel = `${formData.memTel1}-${formData.memTel2}-${formData.memTel3}`

    const memberData = {
      memEmail: formData.memEmail,
      memPw: formData.memPw,
      memName: formData.memName,
      memTel: memTel,
      memAddr: formData.memAddr,
      addrDetail: formData.addrDetail
    }

    try {
      const response = await joinMember(memberData)
      
      if (response.data.success) {
        alert('회원가입이 완료되었습니다')
        navigate('/login')
      }
      
    } catch (error) {
      const message = error.response?.data?.message || '회원가입에 실패했습니다'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Form title='회원가입' onSubmit={handleSubmit}>
      {/* Email */}
      <div className={styles.field_wrapper}>
        <Input 
          label="Email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={formData.memEmail}
          onChange={handleChange('memEmail')}
          button="중복확인"
          onButtonClick={handleEmailCheck}
        />
        {errors.memEmail && <p className={styles.error}>{errors.memEmail}</p>}
        {emailVerified && <p className={styles.success}>✓ 사용 가능한 이메일입니다</p>}
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
        {validated.memPw && <p className={styles.success}>✓ 사용 가능한 비밀번호입니다</p>}
      </div>

      {/* Confirm Password */}
      <div className={styles.field_wrapper}>
        <Input 
          label='Confirm Password'
          type='password'
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPw}
          onChange={handleChange('confirmPw')}
        />
        {errors.confirmPw && <p className={styles.error}>{errors.confirmPw}</p>}
        {validated.confirmPw && <p className={styles.success}>✓ 비밀번호가 일치합니다</p>}
      </div>

      {/* Name */}
      <div className={styles.field_wrapper}>
        <Input 
          label='Name'
          type='text'
          placeholder="이름을 입력하세요"
          value={formData.memName}
          onChange={handleChange('memName')}
        />
        {errors.memName && <p className={styles.error}>{errors.memName}</p>}
        {validated.memName && <p className={styles.success}>✓ 올바른 이름 형식입니다</p>}
      </div>

      {/* Tel */}
      <div className={styles.field_wrapper}>
        <TelInput 
          label='Tel'
          value1={formData.memTel1}
          value2={formData.memTel2}
          value3={formData.memTel3}
          onChange={handleTelChange}
        />
        {errors.memTel && <p className={styles.error}>{errors.memTel}</p>}
        {validated.memTel && <p className={styles.success}>✓ 올바른 전화번호 형식입니다</p>}
      </div>

      {/* Address */}
      <div className={styles.field_wrapper}>
        <AddressInput 
          addrValue={formData.memAddr}
          detailValue={formData.addrDetail}
          onChange={handleAddressChange}
        />
        {errors.memAddr && <p className={styles.error}>{errors.memAddr}</p>}
        {validated.memAddr && <p className={styles.success}>✓ 주소가 입력되었습니다</p>}
      </div>

      {/* Submit Button */}
      <div className={styles.button_group}>
        <Button 
          variant='dark'
          fullWidth={true}
          type='submit'
          disabled={!emailVerified || isSubmitting}
        >
          회원가입
        </Button>
      </div>
    </Form>
  )
}

export default Join