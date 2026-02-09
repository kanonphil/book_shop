import React from 'react'
import styles from './Input.module.css'
import Button from './Button'

const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  defaultValue,
  maxLength,
  button,
  onButtonClick,
  className,
  ...props
}) => {
  return (
    <div className={`${styles.input_group} ${className || ''}`}>
      {label && <label>{label}</label>}
      {button ? (
        <div className={styles.input_with_button}>
          <input 
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
            {...props}
          />
          <Button onClick={onButtonClick} variant='primary'>
            {button}
          </Button>
        </div>
      ) : (
        <input 
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={maxLength}
          {...props}
        />
      )}
    </div>
  )
}

export default Input