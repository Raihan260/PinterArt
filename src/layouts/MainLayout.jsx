import Navbar from '../components/PinterArtNavbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="pt-12">
        <Outlet />
      </div>
    </div>
  )
}
