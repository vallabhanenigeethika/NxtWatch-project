import React, {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {SiYoutubegaming} from 'react-icons/si'
import Header from '../Header'
import SideBar from '../SideBar'
import nxtWatchContext from '../../context/ThemeChanger'
import FailureView from '../FailureView'
import ViewCard from '../ViewCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Gaming = () => {
  const [gamingVideos, setGamingVideos] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  useEffect(() => {
    getVideos()
  }, [])

  const getVideos = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/gaming`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.videos.map(eachVideo => ({
          id: eachVideo.id,
          title: eachVideo.title,
          thumbnailUrl: eachVideo.thumbnail_url,
          viewCount: eachVideo.view_count,
        }))
        setGamingVideos(updatedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      console.error('Error fetching gaming videos:', error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderVideosView = () => (
    <ul className="gaming-video-list">
      {gamingVideos.map(eachVideo => (
        <ViewCard key={eachVideo.id} video={eachVideo} />
      ))}
    </ul>
  )

  const onRetry = () => {
    getVideos()
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderTrendingVideos = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderVideosView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const {isDarkTheme} = useContext(nxtWatchContext)
  const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
  const textColor = isDarkTheme ? '#f9f9f9' : '#231f20'

  return (
    <div>
      <Header />
      <SideBar />
      <div
        className="gaming-container"
        data-testid="gaming"
        style={{backgroundColor: bgColor}}
      >
        <div className="gaming-video-title">
          <div className="gaming-title-icon-container">
            <SiYoutubegaming size={35} color="#ff0000" />
          </div>
          <h1 className="gaming-text" style={{color: textColor}}>
            Gaming
          </h1>
        </div>
        {renderTrendingVideos()}
      </div>
    </div>
  )
}

export default Gaming
