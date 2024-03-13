import './index.css'
import ThemeChanger from '../../context/ThemeChanger'
import React, {useContext} from 'react'
import {Link} from 'react-router-dom'

const ViewCard = props => {
  const {video} = props
  const {
    id,
    title,
    thumbnailUrl,
    viewCount,
    publishedAt,
    name,
    profileImageUrl,
  } = video
  const {isDarkTheme} = useContext(ThemeChanger)
  const textColor = isDarkTheme ? '#ffffff' : '#00306e'

  return (
    
      <div style={{color: textColor}}>
        <Link to={`/videos/${id}`} className="link">
          <li key={id} className="card">
            <img
              src={thumbnailUrl}
              alt="video thumbnail"
              className="thumbnail"
            />
            <section className="Lower">
              <img src={profileImageUrl} alt="channel logo" className="clogo" />
              <div className="txt">
                <p style={{color: textColor}} className="title">
                  {title}
                </p>
                <p style={{color: textColor}} className="name">
                  {name}
                </p>
                <p style={{color: textColor}} className="views">
                  {viewCount} views {publishedAt}
                </p>
              </div>
            </section>
          </li>
        </Link>
      </div>
    
  )
}
export default ViewCard
