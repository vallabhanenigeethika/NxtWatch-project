import React, {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SideBar from '../SideBar'
import ThemeChanger from '../../context/ThemeChanger'
import ViewCard from '../ViewCard'

import FailureView from '../FailureView'
import './index.css'

// const
//import {IoIosSearch} from 'react-icons/io'
import {AiOutlineClose, AiOutlineSearch} from 'react-icons/ai'
// import Loader from 'react-loader-spinner'
// import VideoCard from '../VideoCard'
// import './index.css'
// import SideBar from '../SideBar'
// import {Link} from 'react-router-dom'

const apiStatusVaribles = {
  initial: 'INITIAL',
  in_progress: 'INPROGESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [video, setVideo] = useState([])
  const [apiDetails, setApiDetails] = useState({
    apiStatus: apiStatusVaribles.initial,
    responseData: null,
    errorMsg: null,
  })
  const [show, setShow] = useState('flex')
  const [searchInput, setSearchInput] = useState('')

  const {isDarkTheme} = useContext(ThemeChanger)
  const bgColor = isDarkTheme ? 'black' : 'white'
  const color = isDarkTheme ? 'white' : 'black'
  const display = show === 'flex' ? 'flex' : 'none'

  const onChangeInput = event => {
    setSearchInput(event.target.value)
  }

  const fetchVideo = async () => {
    setApiDetails({
      apiStatus: apiStatusVaribles.in_progress,
      responseData: null,
      errorMsg: null,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, option)
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.videos.map(eachVideo => ({
        id: eachVideo.id,
        title: eachVideo.title,
        thumbnailUrl: eachVideo.thumbnail_url,
        name: eachVideo.channel.name,
        progileImg: eachVideo.channel.profile_image_url,
        viewCount: eachVideo.view_count,
        publishedAt: eachVideo.published_at,
      }))
      setVideo(formattedData)
      setApiDetails({
        apiStatus: apiStatusVaribles.success,
        responseData: formattedData,
        errorMsg: null,
      })
    } else {
      setApiDetails({
        apiStatus: apiStatusVaribles.failure,
        responseData: null,
        errorMsg: error_msg,
      })
    }
  }

  useEffect(() => {
    fetchVideo()
  }, [searchInput])

  const renderLoadingView = () => (
    <div className="loading">
      <Loader type="ThreeDots" color="red" height="50" width="90" />
    </div>
  )
  const getSearch = () => {
    fetchVideo()
  }
  const onRetry = () => {
    setSearchInput('')
    fetchVideo()
  }
  const onCloseBanner = () => {
    setShow('none')
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const lengthOfVideo = video.length

  const renderSuccessView = () => (
    <>
      {lengthOfVideo > 0 ? (
        <ul className="AllVideoList">
          {video.map(eachVideo => (
            <ViewCard id={eachVideo.id} video={eachVideo} />
          ))}
        </ul>
      ) : (
        <div className="notVideoImg" style={{color: color}}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
            alt="no videos"
          />

          <h1 className="failuretext">No Search results found</h1>
          <p className="failuredescription">
            Try different keywords or remove search filter.
          </p>
          <button className="retybtn" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </>
  )

  const renderAllView = () => {
    const {apiStatus} = apiDetails
    switch (apiStatus) {
      case apiStatusVaribles.in_progress:
        return renderLoadingView()
      case apiStatusVaribles.success:
        return renderSuccessView()
      case apiStatusVaribles.failure:
        return renderFailureView()
      default:
        null
    }
  }

  return (
    <>
      <Header />

      <SideBar />
      <div className="Home" style={{color: color, backgroundColor: bgColor}}>
        <div className="banner-container" style={{display}}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="nxt watch logo"
            className="homelogo"
          />
          <p> Buy Nxt Watch Premium prepaid plans with UPI</p>
          <button className="rembtn">GET IT NOW</button>
        </div>
        <div className="banner-right-part">
          <button
            className="banner-close-button"
            data-testid="close"
            onClick={onCloseBanner}
          >
            <AiOutlineClose size={25} />
          </button>
        </div>
      </div>
      <div className="home-content">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeInput}
        />
        <button className="searchbtn" onClick={getSearch}>
          <AiOutlineSearch size={30} />
        </button>
      </div>
      <p>{renderAllView()}</p>
    </>
  )
}
export default Home
