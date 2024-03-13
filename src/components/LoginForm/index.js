import './index.css'
import {useState} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {useNavigate, Navigate} from 'react-router-dom'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showErrormsg, setShowErrormsg] = useState(false)
  const navigate = useNavigate()

  const changeUsername = event => {
    setUsername(event.target.value)
  }
  const changePassword = event => {
    setPassword(event.target.value)
  }
  const onChecking = () => {
    setShowPassword(prevState => !prevState)
  }
  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    navigate('/')
  }
  const onSubmitFailure = errorMsg => {
    setShowErrormsg(true)
    setErrorMsg(errorMsg)
  }
  const onSubmitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'post',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok == true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="container">
      <div className="website-logo">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          alt="website logo"
        />
        <div className="login-form">
          <form className="box" onSubmit={onSubmitForm}>
            <label className="username" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              className="name"
              id="username"
              placeholder="Username"
              onChange={changeUsername}
            />
            <label className="pass" htmlFor="password">
              PASSWORD
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              id="password"
              className="password"
              onChange={changePassword}
            />
            <div>
              <input
                type="checkBox"
                onClick={onChecking}
                id="check"
                value={showPassword}
              />
              <label htmlFor="check">Show Password</label>
            </div>
            <button type="submit" className="btn">
              login
            </button>
          </form>
          {showErrormsg && <p>* {errorMsg}</p>}
        </div>
      </div>
    </div>
  )
}
export default LoginForm
