import React from 'react'
import styles from './Join.module.css'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import TelInput from '../../components/common/TelInput'

const Join = () => {
  const navigate = useNavigate()

  const handleEmailCheck = () => {
    console.log('이메일 중복 확인')
  }

  const handleAddressSearch = () => {
    console.log('주소 검색')
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate(-1)}
        className={styles.navBtn}
      >
        뒤로가기
      </button>

      {/* Email */}
      <Input 
        label="Email"
        type="text"
        placeholder="이메일을 입력하세요"
        button="중복확인"
        onButtonClick={handleEmailCheck}
      />
      {/* <div className={styles.input_group}>
        <label>Email</label>
        <div className={styles.input_with_button}>
          <input type="text" placeholder='이메일을 입력하세요' />
          <button type="button">중복확인</button>
        </div>
      </div> */}

      {/* Password */}
      <Input 
        label='Password'
        type='text'
        placeholder="비밀번호를 입력하세요"
      />
      {/* <div className={styles.input_group}>
        <label>Password</label>
        <input type="text" placeholder='비밀번호를 입력하세요' />
      </div> */}

      {/* Confirm Password */}
      <Input 
        label='Confirm Password'
        type='text'
        placeholder="비밀번호를 다시 입력하세요"
      />
      {/* <div className={styles.input_group}>
        <label>Confirm Password</label>
        <input type="text" placeholder='비밀번호를 다시 입력하세요' />
      </div> */}

      {/* Name */}
      <Input 
        label='Name'
        type='text'
        placeholder="이름을 입력하세요"
      />
      {/* <div className={styles.input_group}>
        <label>Name</label>
        <input type="text" placeholder='이름을 입력하세요' />
      </div> */}

      {/* Tel */}
      <TelInput label='Tel' />
      {/* <div className={styles.input_group}>
        <label>Tel</label>
        <div className={styles.tel_group}>
          <input type="text" maxLength="3" defaultValue="010" />
          <input type="text" maxLength="4" />
          <input type="text" maxLength="4" />
        </div>
      </div> */}

      {/* Address */}
      <Input 
        label='Address'
        type='text'
        placeholder='우편번호'
        button='검색'
        onButtonClick={handleAddressSearch}
      />
      <input type="text" placeholder="상세주소" className={styles.full_input} />
      {/* <div className={styles.input_group}>
        <label>Address</label>
        <div className={styles.input_with_button}>
          <input type="text" placeholder="우편번호" />
          <button>검색</button>
        </div>
        <input type="text" placeholder="상세주소" className={styles.full_input} />
      </div> */}

      {/* Submit Button */}
      <div className={styles.button_group}>
        <button className={styles.submit_button}>회원가입</button>
      </div>
    </div>
  )
}

export default Join