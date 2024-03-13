import React, {useContext} from 'react'

import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import ThemeChanger from '../../context/ThemeChanger'
import {BsMoon, BsBrightnessHigh} from 'react-icons/bs'
import './index.css'

const Header = () => {
  const {isDarkTheme, toggleTheme} = useContext(ThemeChanger)
  const color = isDarkTheme ? '#ffffff' : '#00306e'
  const bgColor = isDarkTheme ? '#231f20' : '#f1f5f9'
  const navigate = useNavigate()

  const onChangeTheme = () => {
    toggleTheme()
  }

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }
  return (
    <nav className="nav-header" style={{backgroundcolor: bgColor}}>
      <div className="HeaderLeft">
        <Link to="/">
          <img
            src={
              isDarkTheme
                ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
                : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
            }
            className="mainlogo"
            alt="website logo"
          />
        </Link>
      </div>
      <div className="headerRight">
        <button className="theme-toggle" onClick={onChangeTheme}>
          {isDarkTheme ? <BsBrightnessHigh size={24} /> : <BsMoon size={24} />}
        </button>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
          alt="profile"
          className="profile"
        />
        <button className="logoutbtn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
export default Header
