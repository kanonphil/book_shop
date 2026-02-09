import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import styles from './ThemeToggle.module.css'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'

const ThemeToggle = () => {
  const {theme, toggleTheme} = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle_button}
      aria-label='다크모드 토글'
    >
      {theme === 'light' ? (
        <IoMoonOutline size={20} />
      ) : (
        <IoSunnyOutline size={20} />
      )}
    </button>
  )
}

export default ThemeToggle