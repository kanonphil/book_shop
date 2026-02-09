import React from 'react'
import styles from './Join.module.css'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import TelInput from '../../components/common/TelInput'
import Button from '../../components/common/Button'
import AddressInput from '../../components/common/AddressInput'
import Form from '../../components/common/Form'

const Join = () => {
  const navigate = useNavigate()

  const handleEmailCheck = () => {
    console.log('이메일 중복 확인')
  }

  const handleAddressSearch = () => {
    console.log('주소 검색')
  }

  const handleSubmit = () => {
    console.log('회원가입')
  }

  return (
    <>
      

      <Form title='회원가입' onSubmit={handleSubmit}>

        {/* Email */}
        <Input 
          label="Email"
          type="text"
          placeholder="이메일을 입력하세요"
          button="중복확인"
          onButtonClick={handleEmailCheck}
        />
  
        {/* Password */}
        <Input 
          label='Password'
          type='text'
          placeholder="비밀번호를 입력하세요"
        />
  
        {/* Confirm Password */}
        <Input 
          label='Confirm Password'
          type='text'
          placeholder="비밀번호를 다시 입력하세요"
        />
  
        {/* Name */}
        <Input 
          label='Name'
          type='text'
          placeholder="이름을 입력하세요"
        />
  
        {/* Tel */}
        <TelInput label='Tel' />
  
        {/* Address */}
        <AddressInput onSearch={handleAddressSearch} />
  
        {/* Submit Button */}
        <div className={styles.button_group}>
          <Button 
            variant='dark'
            fullWidth={true}
            onClick={handleSubmit}
          >
            회원가입
          </Button>

          {/* 뒤로가기 버튼 */}
          <Button 
            onClick={() => navigate(-1)}
            variant='secondary'
            fullWidth={true}
            className={styles.navBtn}
          >
            뒤로가기
          </Button>
        </div>
        
      </Form>
    </>
  )
}

export default Join