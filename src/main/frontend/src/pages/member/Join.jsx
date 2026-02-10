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
  const [emailVerified, setEmailVerified] = useState(false) // 이메일 중복 확인 상태
  const [isSubmitting, setIsSubmitting] = useState(false) // 제출 중 상태
  const [passwordMatch, setPasswordMatch] = useState(false) // 비밀번호 확인

  // 입력값 변경 핸들러
  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    })

    // 이메일이 변경되면 중복 확인 상태 초기화
    if (field === 'memEmail') {
      setEmailVerified(false)
    }

    // confirmPw 입력 시 실시간 검증
    if (field === 'confirmPw') {
      // confirmPw가 비어있지 않고 && 일치하면
      if (e.target.value && formData.memPw === e.target.value) {
        setPasswordMatch(true)
        setErrors({
          ...errors,
          confirmPw: ''
        })
      } else if (e.target.value && formData.memPw !== e.target.value) {
        setPasswordMatch(false)
        setErrors({
          ...errors,
          confirmPw: '비밀번호가 일치하지 않습니다'
        })
      } else {
        // 비어있으면 둘 다 fasle
        setPasswordMatch(false)
      }
    }
    
    // 에러 초기화
    if (errors[field] && field !== 'confirmPw') {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  // 전화번호 변경 핸들러
  const handleTelChange = (tel1, tel2, tel3) => {
    setFormData({
      ...formData,
      memTel1: tel1,
      memTel2: tel2,
      memTel3: tel3
    })
    if (errors.memTel) {
      setErrors({
        ...errors,
        memTel: ''
      })
    }
  }

  // 주소 변경 핸들러
  const handleAddressChange = (addr, detail) => {
    setFormData({
      ...formData,
      memAddr: addr,
      addrDetail: detail
    })
  }

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    // 이메일 형식 검증
    if (!formData.memEmail) {
      alert('이메일을 입력하세요')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.memEmail)) {
      alert('올바른 이메일 형식이 아닙니다')
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

  // 유효성 검사
  const validate = () => {
    const newErrors = {}

    // 이메일 검증
    if (!formData.memEmail) {
      newErrors.memEmail = '이메일을 입력하세요'
    } else if (!/\S+@\S+\.\S+/.test(formData.memEmail)) {
      newErrors.memEmail = '올바른 이메일 형식이 아닙니다'
    }

    // 비밀번호 검증
    if (!formData.memPw) {
      newErrors.memPw = '비밀번호를 입력하세요'
    } else if (formData.memPw.length < 4) {
      newErrors.memPw = '비밀번호는 4자 이상이어야 합니다'
    }

    // 비밀번호 확인
    if (formData.memPw !== formData.confirmPw) {
      newErrors.confirmPw = '비밀번호가 일치하지 않습니다'
    }

    // 이름 검증
    if (!formData.memName) {
      newErrors.memName = '이름을 입력하세요'
    }

    // 전화번호 검증
    if (!formData.memTel2 || !formData.memTel3) {
      newErrors.memTel = '전화번호를 입력하세요'
    }

    // 주소 검증
    if (!formData.memAddr) {
      newErrors.memAddr = '주소를 입력하세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 유효성 검사
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // 전화번호 조합
    const memTel = `${formData.memTel1}-${formData.memTel2}-${formData.memTel3}`

    // 서버로 전송할 데이터
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
      // console.error('회원가입 실패:', error)
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
        {passwordMatch && <p className={styles.success}>✓ 비밀번호가 일치합니다</p>}
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
      </div>

      {/* Address */}
      <div className={styles.field_wrapper}>
        <AddressInput 
          //onSearch={handleAddressSearch}
          addrValue={formData.memAddr}
          detailValue={formData.addrDetail}
          onChange={handleAddressChange}
        />
        {errors.memAddr && <p className={styles.error}>{errors.memAddr}</p>}
      </div>

      {/* Submit Button */}
      <div className={styles.button_group}>
        <Button 
          variant='dark'
          fullWidth={true}
          type='submit'
          disabled={!emailVerified || isSubmitting} // 이메일 미확인 시 비활성화
        >
          회원가입
        </Button>

        {/* 뒤로가기 버튼 */}
        <Button 
          onClick={() => navigate('/')}
          variant='secondary'
          fullWidth={true}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>
    </Form>
  )
}

export default Join