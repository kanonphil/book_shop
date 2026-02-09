import React from 'react'
import styles from './Button.module.css'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''}`

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button