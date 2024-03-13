import {useContext} from 'react'
import ThemeChanger from '../../context/ThemeChanger'

const FailureView = ({onRetry}) => {
  const {isDarkTheme} = useContext(ThemeChanger)

  const headingColor = isDarkTheme ? '#f1f5f9' : '#1e293b'
  const noteColor = isDarkTheme ? '#e2e8f0' : '#475569'

  const failureImgUrl = isDarkTheme
    ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
    : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

  const onClickRetry = () => {
    onRetry()
  }

  return (
    <div className="failure-view">
      <img className="failure-img" src={failureImgUrl} alt="failure view" />
      <h1 className="failure-heading" style={{color: headingColor}}>
        Oops Something Went Wrong
      </h1>
      <p className="failure-para" style={{color: noteColor}}>
        We are having some trouble to complete your request. <br /> Please try
        again later.
      </p>
      <button className="button" onClick={onClickRetry}>
        Retry
      </button>
    </div>
  )
}
export default FailureView
