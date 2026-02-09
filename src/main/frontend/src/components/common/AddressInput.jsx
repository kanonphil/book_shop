import React from 'react'
import styles from './AddressInput.module.css'
import Input from './Input'

const AddressInput = ({
  label = 'Address',
  onSearch
}) => {
  return (
    <div
      className={styles.address_container}
    >
      <Input 
        label={label}
        type='text'
        placeholder='우편번호'
        button='검색'
        onButtonClick={onSearch}
        className={styles.no_margin}
      />
      <input 
        type="text" 
        placeholder="상세주소" 
        className={styles.detail_input} 
      />
    </div>
  )
}

export default AddressInput