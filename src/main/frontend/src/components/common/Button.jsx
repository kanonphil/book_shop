import React from 'react'
import styles from './Button.module.css'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${size[size]} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
    >
      {children}
    </button>
  )
}

export default Button