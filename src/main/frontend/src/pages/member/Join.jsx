import React, { useState, useEffect } from 'react'
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
  const validateField = (field, value, compareValue = null) => {
    switch (field) {
      case 'memEmail':
        if (!value) return '이메일을 입력하세요'
        if (!emailRegEx.test(value)) return '올바른 이메일 형식이 아닙니다'
        return ''

      case 'memPw':
        if (!value) return '비밀번호를 입력하세요'
        if (!passwordRegEx.test(value)) return '비밀번호는 영문 대소문자, 숫자를 혼합하여 4~12자로 입력해주세요'
        return ''

      case 'confirmPw': {
        if (!value) return '비밀번호 확인을 입력하세요'
        // compareValue가 있으면 사용, 없으면 formData.memPw 사용
        const passwordToCompare = compareValue !== null ? compareValue : formData.memPw
        if (value !== passwordToCompare) return '비밀번호가 일치하지 않습니다'
        return ''
      }

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

  // 초기 에러 상태 설정
  useEffect(() => {
    const tel1Error = validateField('memTel1', '010')
    const tel2Error = validateField('memTel2', '')
    const tel3Error = validateField('memTel3', '')
    const telError = tel1Error || tel2Error || tel3Error

    setErrors({
      memEmail: '이메일을 입력하세요',
      memPw: '비밀번호를 입력하세요',
      confirmPw: '비밀번호 확인을 입력하세요',
      memName: '이름을 입력하세요',
      memTel: telError,
      memAddr: '주소를 입력하세요'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 초기 마운트 시에만 실행

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
      const confirmError = validateField('confirmPw', formData.confirmPw, value)
      setErrors(prev => ({ ...prev, confirmPw: confirmError }))
      setValidated(prev => ({ 
        ...prev, 
        confirmPw: !confirmError && formData.confirmPw !== '' 
      }))
    }

    // confirmPw 변경 시 일치 여부 확인
    if (field === 'confirmPw') {
      const confirmError = validateField('confirmPw', value, formData.memPw)
      setValidated(prev => ({ 
        ...prev, 
        confirmPw: !confirmError && value !== '' 
      }))

      // 에러도 update
      setErrors(prev => ({
        ...prev,
        confirmPw: confirmError
      }))

      return
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
      <Input 
        label="Email"
        type="email"
        name="memEmail"
        placeholder="이메일을 입력하세요"
        value={formData.memEmail}
        onChange={handleChange('memEmail')}
        button="중복확인"
        onButtonClick={handleEmailCheck}
        error={errors.memEmail}
        required
      />
      {emailVerified && <p className={styles.success}>✓ 사용 가능한 이메일입니다</p>}

      {/* Password */}
      <Input 
        label='Password'
        type='password'
        name="memPw"
        placeholder="비밀번호를 입력하세요"
        value={formData.memPw}
        onChange={handleChange('memPw')}
        error={errors.memPw}
        required
      />
      {validated.memPw && <p className={styles.success}>✓ 사용 가능한 비밀번호입니다</p>}

      {/* Confirm Password */}
      <Input 
        label='Confirm Password'
        type='password'
        name="confirmPw"
        placeholder="비밀번호를 다시 입력하세요"
        value={formData.confirmPw}
        onChange={handleChange('confirmPw')}
        error={errors.confirmPw}
        required
      />
      {validated.confirmPw && <p className={styles.success}>✓ 비밀번호가 일치합니다</p>}

      {/* Name */}
      <Input 
        label='Name'
        type='text'
        name="memName"
        placeholder="이름을 입력하세요"
        value={formData.memName}
        onChange={handleChange('memName')}
        error={errors.memName}
        required
      />
      {validated.memName && <p className={styles.success}>✓ 올바른 이름 형식입니다</p>}

      {/* Tel */}
      <TelInput 
        label='Tel'
        name="memTel"
        value1={formData.memTel1}
        value2={formData.memTel2}
        value3={formData.memTel3}
        onChange={handleTelChange}
        error={errors.memTel}
        required
      />
      {validated.memTel && <p className={styles.success}>✓ 올바른 전화번호 형식입니다</p>}

      {/* Address */}
      <AddressInput 
        label="Address"
        name="memAddr"
        addrValue={formData.memAddr}
        detailValue={formData.addrDetail}
        onChange={handleAddressChange}
        error={errors.memAddr}
        required
      />
      {validated.memAddr && <p className={styles.success}>✓ 주소가 입력되었습니다</p>}

      {/* Submit Button */}
      <div className={styles.buttonGroup}>
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