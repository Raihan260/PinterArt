// Cara menjalankan proyek (Vite React):
// 1) Buka terminal di folder: d:\Semester 5\PinterArt_MMS\pinterart-vite-react
// 2) Install dependensi: npm install
// 3) Jalankan dev server: npm run dev
// 4) Buka URL yang muncul (contoh: http://localhost:5173)
//    - Halaman Login: /
//    - Halaman Feed: /feed

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PinterArtAuth from './components/PinterArtAuth'
import PinterArtHome from './components/PinterArtHome'
import PinterArtCreate from './components/PinterArtCreate'
import PinterArtProfile from './components/PinterArtProfile' // <-- 1. Import ini
import PinterArtDashboard from './components/PinterArtDashboard' // <-- 1. Import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PinterArtAuth />} />
        <Route path="/feed" element={<PinterArtHome />} />
        <Route path="/create" element={<PinterArtCreate />} />
        
        {/* <-- 2. Tambahkan Route Profil */}
        <Route path="/profile" element={<PinterArtProfile />} />
        <Route path="/dashboard" element={<PinterArtDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}