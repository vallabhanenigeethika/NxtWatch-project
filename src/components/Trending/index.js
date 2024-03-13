import React, {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {HiFire} from 'react-icons/hi'
import ThemeChanger from '../../context/ThemeChanger'
import FailureView from '../FailureView'
import ViewCard from '../ViewCard'
import Header from '../Header'
import SideBar from '../SideBar'

const Trending = () => {
  const [trendingVideos, setTrendingVideos] = useState([])
  const [apiStatus, setApiStatus] = useState('INITIAL')

  useEffect(() => {
    getVideos()
  }, [])

  const getVideos = async () => {
    setApiStatus('IN_PROGRESS')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/trending`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.videos.map(eachVideo => ({
        id: eachVideo.id,
        title: eachVideo.title,
        thumbnailUrl: eachVideo.thumbnail_url,
        viewCount: eachVideo.view_count,
        publishedAt: eachVideo.published_at,
        name: eachVideo.channel.name,
        profileImageUrl: eachVideo.channel.profile_image_url,
      }))
      setTrendingVideos(updatedData)
      setApiStatus('SUCCESS')
    } else {
      setApiStatus('FAILURE')
    }
  }

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  const renderVideosView = () => (
    <ul className="trending-video-list">
      {trendingVideos.map(eachVideo => (
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
      case 'SUCCESS':
        return renderVideosView()
      case 'FAILURE':
        return renderFailureView()
      case 'IN_PROGRESS':
        return renderLoadingView()
      default:
        return null
    }
  }

  const {isDarkTheme} = useContext(ThemeChanger)
  const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
  const textColor = isDarkTheme ? '#f9f9f9' : '#231f20'

  return (
    <div data-testid="trending">
      <Header />
      <SideBar />
      <div
        className="trending-container"
        data-testid="trending"
        style={{backgroundColor: bgColor}}
      >
        <div className="trending-video-title">
          <div className="title-icon-container">
            <HiFire size={35} color="#ff0000" />
          </div>
          <h1 className="trending-text" style={{color: textColor}}>
            Trending
          </h1>
        </div>
        {renderTrendingVideos()}
      </div>
    </div>
  )
}

export default Trending
