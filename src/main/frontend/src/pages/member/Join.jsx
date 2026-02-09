import React, { useState } from 'react'
import styles from './Join.module.css'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import TelInput from '../../components/common/TelInput'
import Button from '../../components/common/Button'
import AddressInput from '../../components/common/AddressInput'
import Form from '../../components/common/Form'
import axios from 'axios'

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

  // 입력값 변경 핸들러
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
    console.log('주소 변경:', addr, detail)  // 디버깅용
    setFormData({
      ...formData,
      memAddr: addr,
      addrDetail: detail
    })
  }

  // 우편번호 검색 콜백 (선택사항)
  const handleAddressSearch = (data) => {
    console.log('우편번호:', data.zonecode)
    console.log('기본주소:', data.address)
    console.log('도로명주소:', data.roadAddress)
    console.log('지번주소:', data.jibunAddress)
  }

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!formData.memEmail) {
      alert('이메일을 입력하세요')
      return
    }
    
    try {
      const response = await axios.get(`http://localhost:8080/members/check-email/${formData.memEmail}`)
      
      if (response.data.isDuplicate) {
        alert('이미 사용 중인 이메일입니다')
      } else {
        alert('사용 가능한 이메일입니다')
      }
    } catch (error) {
      console.error('이메일 확인 실패:', error)
      alert('이메일 확인 중 오류가 발생했습니다')
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
      const response = await axios.post('http://localhost:8080/members/join', memberData)
      
      if (response.data.success) {
        alert('회원가입이 완료되었습니다')
        navigate('/login')
      }
      
    } catch (error) {
      console.error('회원가입 실패:', error)
      const message = error.response?.data?.message || '회원가입에 실패했습니다'
      alert(message)
    }
  }
  
  return (
    <Form title='회원가입' onSubmit={handleSubmit}>
      {/* Email */}
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

      {/* Password */}
      <Input 
        label='Password'
        type='password'
        placeholder="비밀번호를 입력하세요"
        value={formData.memPw}
        onChange={handleChange('memPw')}
      />
      {errors.memPw && <p className={styles.error}>{errors.memPw}</p>}

      {/* Confirm Password */}
      <Input 
        label='Confirm Password'
        type='password'
        placeholder="비밀번호를 다시 입력하세요"
        value={formData.confirmPw}
        onChange={handleChange('confirmPw')}
      />
      {errors.confirmPw && <p className={styles.error}>{errors.confirmPw}</p>}

      {/* Name */}
      <Input 
        label='Name'
        type='text'
        placeholder="이름을 입력하세요"
        value={formData.memName}
        onChange={handleChange('memName')}
      />
      {errors.memName && <p className={styles.error}>{errors.memName}</p>}

      {/* Tel */}
      <TelInput 
        label='Tel'
        value1={formData.memTel1}
        value2={formData.memTel2}
        value3={formData.memTel3}
        onChange={handleTelChange}
      />
      {errors.memTel && <p className={styles.error}>{errors.memTel}</p>}

      {/* Address */}
      <AddressInput 
        onSearch={handleAddressSearch}
        addrValue={formData.memAddr}
        detailValue={formData.addrDetail}
        onChange={handleAddressChange}
      />
      {errors.memAddr && <p className={styles.error}>{errors.memAddr}</p>}

      {/* Submit Button */}
      <div className={styles.button_group}>
        <Button 
          variant='dark'
          fullWidth={true}
          type='submit'
        >
          회원가입
        </Button>

        {/* 뒤로가기 버튼 */}
        <Button 
          onClick={() => navigate('/')}
          variant='secondary'
          fullWidth={true}
        >
          취소
        </Button>
      </div>
    </Form>
  )
}

export default Join