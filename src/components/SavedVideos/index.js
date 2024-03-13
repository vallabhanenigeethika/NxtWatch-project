import React, {useContext} from 'react'
import ThemeChanger from '../../context/ThemeChanger'
import Header from '../Header'
import SideBar from '../SideBar'
import ViewCard from '../ViewCard'
import {CgPlayListAdd} from 'react-icons/cg'
//import './index.css'

const SavedVideos = () => {
  const {isDarkTheme, savedVideos} = useContext(ThemeChanger)
  const bgColor = isDarkTheme ? 'black' : 'white'
  const txtColor = isDarkTheme ? 'white' : 'black'
  const list = savedVideos.length
  return (
    <>
      <Header />
      <div className="min">
        <SideBar />
        <div
          className="SavedVideos"
          style={{backgroundColor: bgColor, color: txtColor}}
        >
          <CgPlayListAdd size={35} color="#ff0000" />

          {list > 0 ? (
            <div>
              {savedVideos.map(eachVideos => (
                <ViewCard id={eachVideos.id} video={eachVideos} />
              ))}
            </div>
          ) : (
            <div style={{backgroundColor: bgColor, color: txtColor}}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                alt="no saved videos"
              />
              <h3>No saved videos found</h3>
              <p>You can save your videos while watching them</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default SavedVideos
