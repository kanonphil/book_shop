import React from 'react'
import styles from './AddressInput.module.css'
import Input from './Input'

const AddressInput = ({ 
  label = "Address", 
  onSearch, 
  addrValue = '', 
  detailValue = '', 
  onChange 
}) => {
  const handleDetailChange = (e) => {
    if (onChange) {
      onChange(addrValue, e.target.value)
    }
  }

  // 다음 우편번호 API 호출
  const handlePostcode = () => {
    new window.kakao.Postcode({
      oncomplete: function(data) {
        // 선택한 주소 정보를 받아옴
        let fullAddress = data.address // 기본 주소
        let extraAddress = '' // 참고 항목

        // 도로명 주소인 경우 추가 정보 처리
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName)
          }
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '')
        }

        // 우편번호와 주소 정보를 state에 저장
        if (onChange) {
          onChange(fullAddress, detailValue)
        }

        // 검색 콜백 호출 (필요시)
        if (onSearch) {
          onSearch(data)
        }

        // 상세주소 input에 포커스
        const detailInput = document.querySelector(`.${styles.detail_input}`)
        if (detailInput) {
          detailInput.focus()
        }
      }
    }).open()
  }

  return (
    <div className={styles.address_container}>
      <Input 
        label={label}
        type='text'
        placeholder='우편번호'
        value={addrValue}
        button='검색'
        onButtonClick={handlePostcode}
        className={styles.no_margin}
        readOnly={true}
      />
      <input 
        type="text" 
        placeholder="상세주소" 
        className={styles.detail_input}
        value={detailValue}
        onChange={handleDetailChange}
      />
    </div>
  )
}

export default AddressInput