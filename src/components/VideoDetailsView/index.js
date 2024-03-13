import {useState, useEffect, useContext} from 'react'
import ThemeChanger from '../../context/ThemeChanger'
import Cookies from 'js-cookie'
import Header from '../Header'
import SideBar from '../SideBar'
import Loader from 'react-loader-spinner'
import {useParams} from 'react-router-dom'
import ReactPlayer from 'react-player'
import {GrLike, GrDislike} from 'react-icons/gr'
import {IoSaveOutline} from 'react-icons/io5'
//import SavedVideos from '../SavedVideos'
import FailureView from '../FailureView'

const apiStatusVariables = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const VideoDetailsView = () => {
  const [apiDetails, setApiDetails] = useState({
    apiStatus: apiStatusVariables.initial,
    responseData: null,
    errorMsg: null,
  })
  const [like, setLike] = useState(false)
  const [dislike, setDislike] = useState(false)

  const {id} = useParams()
  const [videoView, setVideoView] = useState([])
  const {isDarkTheme, addVideo, savedVideos} = useContext(ThemeChanger)
  const bgColor = isDarkTheme ? 'black' : 'white'
  const txtColor = isDarkTheme ? 'white' : 'black'
  const likeColor = like ? 'blue' : ''
  const dislikeColor = dislike ? 'blue' : ''

  let isSaved
  const index = savedVideos.findIndex(
    eachVideo => eachVideo.id === videoView.id,
  )
  if (index === -1) {
    isSaved = false
  } else {
    isSaved = true
  }
  const saveIconColor = isSaved ? '#2563eb' : ''
  const txtSave = isSaved ? 'Saved' : 'Save'

  const clickSave = () => {
    addVideo(videoView)
  }

  const clickLike = () => {
    setLike(true)
    setDislike(false)
  }

  const clickDisLike = () => {
    setDislike(true)
    setLike(false)
  }

  const getVideo = async () => {
    setApiDetails({
      apiStatus: apiStatusVariables.inProgress,
      responseData: null,
      errorMsg: null,
    })
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, option)
    const data = await response.json()
    if (response.ok) {
      const formattedData = {
        id: data.video_details.id,
        title: data.video_details.title,
        videoUrl: data.video_details.video_url,
        thumbnailUrl: data.video_details.thumbnail_url,
        name: data.video_details.channel.name,
        profileImg: data.video_details.channel.profile_imgage_url,
        subscribeCount: data.video_details.channel.subscriber_count,
        viewCount: data.video_details.view_count,
        publishedAt: data.video_details.published_at,
        description: data.video_details.description,
      }
      setVideoView(formattedData)
      setApiDetails({
        apiStatus: apiStatusVariables.success,
        responseData: data,
        errorMsg: null,
      })
    } else {
      setApiDetails({
        apiStatus: apiStatusVariables.failure,
        responseData: null,
        errorMsg: data.error_msg,
      })
    }
  }
  useEffect(() => {
    getVideo()
  }, [])

  const renderLoadingView = () => (
    <div>
      <Loader type="ThreeDots" width={30} height={30} />
    </div>
  )

  const renderFailureView = () => (
   <FailureView onRetry={onRetry}/>
  )
  const renderSuccessView = () => (
    // <div
    //   style={{color: txtColor, backgroundColor: bgColor}}
    //   className="mainVideoplayer"
    // >
    //   <ReactPlayer
    //     url={videoView.videoUrl}
    //     controls
    //     width="100%"
    //     height="600px"
    //   />
    //   <div className="videoView">
    //     <p>{videoView.title}</p>
    //     <div className="s1">
    //       <div className="left1">
    //         <span> {videoView.videoView} Views </span>
    //         <span>{videoView.publishedAt}</span>
    //       </div>
    //       <div className="right1">
    //         <span
    //           className="ybtn"
    //           style={{color: likeColor}}
    //           onClick={clickLike}
    //         >
    //           <GrLike /> Like
    //         </span>
    //         <span
    //           className="ybtn"
    //           style={{color: dislikeColor}}
    //           onClick={clickDisLike}
    //         >
    //           <GrDislike /> Dislike
    //         </span>
    //         <span
    //           className="ybtns"
    //           onClick={clickSave}
    //           style={{color: saveIconColor}}
    //         >
    //           <IoSaveOutline /> {txtSave}
    //         </span>
    //       </div>
    //     </div>
    //     <div className="s2">
    //       <div className="left">
    //         <img src={videoView.thumbnailUrl} className="yicon" />
    //       </div>
    //       <div className="right">
    //         <p>{videoView.name}</p>
    //         <p style={{marginBottom: '20px'}}>
    //           {videoView.subscribeCount} subscribed
    //         </p>
    //         <p>{videoView.description}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div style={{color: txtColor, backgroundColor: bgColor}}>
      <ReactPlayer url={videoView.videoUrl} width="100%" height="600px" />
      <div>
        <p>{videoView.title}</p>
        <div>
          <span> {videoView.videoCount} views</span>
          <span> {videoView.publishedAt}</span>
        </div>
        <div>
          <span style={{color: likeColor}} onClick={clickLike}>
            <GrLike /> Like
          </span>
          <span style={{color: dislikeColor}} onClick={clickDisLike}>
            <GrDislike />
            Dislike
          </span>
          <span style={{color: saveIconColor}} onClick={clickSave}>
            <IoSaveOutline />
            {txtSave}
          </span>
        </div>
      </div>
      <div>
        <img src={videoView.thumbnailUrl} />
        <div>
          <p>{videoView.name}</p>
          <p>{videoView.subscribeCount} subsc</p>
          <p>{videoView.description}</p>
        </div>
      </div>
    </div>
  )
  const renderAllView = () => {
    const {apiStatus} = apiDetails
    switch (apiStatus) {
      case apiStatusVariables.inProgress:
        return renderLoadingView()
      case apiStatusVariables.success:
        return renderSuccessView()
      case apiStatusVariables.failure:
        return renderFailureView()
      default:
        null
    }
  }

  return (
    <>
      <Header />
      <div>
        <SideBar />
        {renderAllView()}
      </div>
    </>
  )
}
export default VideoDetailsView

// import {useState, useEffect, useContext} from 'react'
// import ThemeChanger from '../../context/ThemeChanger'
// import Cookies from 'js-cookie'
// import Header from '../Header'
// import SideBar from '../SideBar'
// import Loader from 'react-loader-spinner'
// import {useParams} from 'react-router-dom'
// import ReactPlayer from 'react-player'
// import {GrLike, GrDislike} from 'react-icons/gr'
// import {IoSaveOutline} from 'react-icons/io5'
// //import SavedVideos from '../SavedVideos'
// const apiStatusVaribles = {
//   initial: 'INITIAL',
//   in_progress: 'IN_PROGRESS',
//   success: 'SUCCESS',
//   failure: 'FAILURE',
// }

// const VideoDetailsView = () => {
//   const [apiDetails, setApiDetails] = useState({
//     apistatus: apiStatusVaribles.initial,
//     responseData: null,
//     errorMsg: null,
//   })
//   const [like, setLike] = useState(false)
//   const [dislike, setDislike] = useState(false)

//   const {id} = useParams()
//   const [videoView, setVideoView] = useState([])
//   const {isDarkTheme, addVideo, savedVideos} = useContext(ThemeChanger)
//   const bgColor = isDarkTheme ? 'black' : 'white'
//   const txtColor = isDarkTheme ? 'white' : 'black'
//   const likeColor = like ? 'blue' : ''
//   const dislikeColor = dislike ? 'blue' : ''

//   let isSaved
//   const index = savedVideos.findIndex(
//     eachVideo => eachVideo.id === videoView.id,
//   )
//   if (index === -1) {
//     isSaved = false
//   } else {
//     isSaved = true
//   }
//   const saveIconColor = isSaved ? '#2563eb' : ''
//   const txtSave = isSaved ? 'Saved' : 'Save'

//   const clickSave = () => {
//     addVideo(videoView)
//   }

//   const clickLike = () => {
//     setLike(true)
//     setDislike(false)
//   }

//   const clickDisLike = () => {
//     setDislike(true)
//     setLike(false)
//   }

//   const videoFetch = async () => {
//     setApiDetails({
//       apistatus: apiStatusVaribles.in_progress,
//       responseData: null,
//       errorMsg: null,
//     })
//     const apiUrl = `https://apis.ccbp.in/videos/${id}`
//     const jwtToken = Cookies.get('jwt_token')
//     const option = {
//       headers: {
//         Authorization: `Bearer ${jwtToken}`,
//       },
//       method: 'GET',
//     }

//     const response = await fetch(apiUrl, option)
//     const data = await response.json()
//     if (response.ok) {
//       const formattedData = {
//         id: data.video_details.id,
//         title: data.video_details.title,
//         videoUrl: data.video_details.video_url,
//         thumbnailUrl: data.video_details.thumbnail_url,
//         name: data.video_details.channel.name,
//         profileImg: data.video_details.channel.profile_imgage_url,
//         subscribeCount: data.video_details.channel.subscriber_count,
//         viewCount: data.video_details.view_count,
//         publishedAt: data.video_details.published_at,
//         description: data.video_details.description,
//       }
//       setVideoView(formattedData)
//       setApiDetails({
//         apistatus: apiStatusVaribles.success,
//         responseData: data,
//         errorMsg: null,
//       })
//     } else
//       [
//         setApiDetails({
//           apistatus: apiStatusVaribles.failure,
//           responseData: null,
//           errorMsg: data.error_msg,
//         }),
//       ]
//   }

//   useEffect(() => {
//     videoFetch()
//   }, [])

//   const renderLoadingView = () => (
//     <div>
//       <Loader type="ThreeDots" width={30} height={30} />
//     </div>
//   )

//   const renderFailureView = () => (
//     <div
//       className="failureView"
//       style={{backgroundColor: bgColor, color: txtColor}}
//     >
//       {isDarkTheme ? (
//         <img
//           src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
//           className="failureimg"
//         />
//       ) : (
//         <img
//           src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png"
//           className="failureimg"
//         />
//       )}
//       <h1 className="failuretext">Oops! Something Went Wrong</h1>
//       <p className="failuredescription">
//         We are having some trouble processing your request. Please try again.
//       </p>
//       <button className="retybtn">Retry</button>
//     </div>
//   )

//   const renderSuccessView = () => (
//     <div
//       style={{color: txtColor, backgroundColor: bgColor}}
//       className="mainVideoplayer"
//     >
//       <ReactPlayer
//         url={videoView.videoUrl}
//         controls
//         width="100%"
//         height="600px"
//       />
//       <div className="videoView">
//         <p>{videoView.title}</p>
//         <div className="s1">
//           <div className="left1">
//             <span> {videoView.videoView} Views </span>
//             <span>{videoView.publishedAt}</span>
//           </div>
//           <div className="right1">
//             <span
//               className="ybtn"
//               style={{color: likeColor}}
//               onClick={clickLike}
//             >
//               <GrLike /> Like
//             </span>
//             <span
//               className="ybtn"
//               style={{color: dislikeColor}}
//               onClick={clickDisLike}
//             >
//               <GrDislike /> Dislike
//             </span>
//             <span
//               className="ybtns"
//               onClick={clickSave}
//               style={{color: saveIconColor}}
//             >
//               <IoSaveOutline /> {txtSave}
//             </span>
//           </div>
//         </div>
//         <div className="s2">
//           <div className="left">
//             <img src={videoView.thumbnailUrl} className="yicon" />
//           </div>
//           <div className="right">
//             <p>{videoView.name}</p>
//             <p style={{marginBottom: '20px'}}>
//               {videoView.subscribeCount} subscribed
//             </p>
//             <p>{videoView.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   const renderAllView = () => {
//     const {apistatus} = apiDetails
//     switch (apistatus) {
//       case apiStatusVaribles.in_progress:
//         return renderLoadingView()
//       case apiStatusVaribles.success:
//         return renderSuccessView()
//       case apiStatusVaribles.failure:
//         return renderFailureView()
//       default:
//         null
//     }
//   }

//   return (
//     <>
//       <Header />
//       <div className="min">
//         <SideBar />
//         {renderAllView()}
//       </div>
//     </>
//   )
// }
// export default VideoDetailsView
