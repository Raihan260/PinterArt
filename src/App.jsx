import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PinterArtAuth from './components/PinterArtAuth'
import PinterArtHome from './components/PinterArtHome'
import PinterArtCreate from './components/PinterArtCreate'
import PinterArtProfile from './components/PinterArtProfile'
import PinterArtDashboard from './components/PinterArtDashboard'
import PinterArtCommunity from './components/PinterArtCommunity'

import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<PinterArtAuth />} />

        {/* MAIN APP (dengan Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/main" element={<PinterArtHome />} />
          <Route path="/create" element={<PinterArtCreate />} />
          <Route path="/community" element={<PinterArtCommunity />} />
          <Route path="/profile" element={<PinterArtProfile />} />
          <Route path="/dashboard" element={<PinterArtDashboard />} />
        </Route>

        {/* BACKWARD COMPATIBILITY */}
        <Route path="/feed" element={<Navigate to="/main" replace />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}