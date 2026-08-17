import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { Home } from './pages/Home'
import { Notes } from './pages/Notes'
import { Feedback } from './pages/Feedback'
import { About } from './pages/About'

function App() {
  const location = useLocation()

  return (
    <div className="page-wrapper">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
