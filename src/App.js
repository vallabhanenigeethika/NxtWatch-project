import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import ThemeChanger from './context/ThemeChanger'
import {useState, useContext} from 'react'
import Trending from './components/Trending'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Gaming from './components/Gaming'
import Home from './components/Home'
import VideoDetailsView from './components/VideoDetailsView'
import SavedVideos from './components/SavedVideos'
// Replace your code here
const App = () => {
  const [savedVideos, setSavedVideos] = useState([])
  const [activeTab, setActiveTab] = useState('Home')
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const changeTab = tab => {
    setActiveTab(tab)
  }
  const toggleTheme = () => {
    setIsDarkTheme(prevState => !prevState)
  }
  const addVideo = video => {
    const index = savedVideos.findIndex(eachVideo => eachVideo.id === video.id)
    if (index === -1) {
      setSavedVideos([...savedVideos, video])
    } else {
      const updatedSavedVideos = savedVideos.filter(
        eachVideo => eachVideo.id !== video.id,
      )
      setSavedVideos(updatedSavedVideos)
    }
  }

  return (
    <ThemeChanger.Provider
      value={{
        savedVideos,
        isDarkTheme,
        activeTab,
        toggleTheme,
        addVideo,
        changeTab,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <Trending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gaming"
            element={
              <ProtectedRoute>
                <Gaming />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos/:id"
            element={
              <ProtectedRoute>
                <VideoDetailsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savevideo"
            element={
              <ProtectedRoute>
                <SavedVideos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeChanger.Provider>
  )
}

export default App
