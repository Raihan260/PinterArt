import { useState, useEffect, useRef } from 'react'
import { Bell, MessageCircle, User, Search, X, Heart, CheckCircle, DollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { pathname } = useLocation()

  const isHome = pathname.startsWith('/main')
  const isCreate = pathname.startsWith('/create')

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const notifRef = useRef(null)
  const chatRef = useRef(null)

  // ✅ STYLE TAB (INI YANG MENYAMAKAN DESAIN)
  const baseTab =
    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors'

  const inactiveTab =
    'bg-gray-50 border border-gray-200 hover:bg-gray-100'

  const activeTab =
    'bg-black text-white'

  const notifications = [
    { id: 1, type: 'money', text: 'Seseorang berlangganan karyamu!', time: '2m', amount: '+Rp 50.000', read: false },
    { id: 2, type: 'like', text: 'Sarah Arts menyukai "Cyberpunk City"', time: '1j', read: true },
    { id: 3, type: 'follow', text: 'Budi Design mulai mengikuti Anda', time: '3j', read: true },
    { id: 4, type: 'system', text: 'Selamat datang di PinterArt Premium!', time: '1h', read: true },
  ]

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false)
        setIsChatOpen(false)
      }
    }

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false)
      if (chatRef.current && !chatRef.current.contains(e.target)) setIsChatOpen(false)
    }

    window.addEventListener('keydown', handleEsc)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 relative">
        <span className="text-xl font-bold text-red-600">PinterArt</span>

        <div className="hidden sm:flex gap-2">
          {/* BERANDA */}
          <Link
            to="/main"
            className={`${baseTab} ${isHome ? activeTab : inactiveTab}`}
          >
            Beranda
          </Link>

          {/* BUAT */}
          <Link
            to="/create"
            className={`${baseTab} ${isCreate ? activeTab : inactiveTab}`}
          >
            Buat
          </Link>
        </div>

        <div className="flex-1 mx-2">
          <div className="flex items-center gap-2 rounded-full border bg-gray-100 px-3 py-2 focus-within:bg-white">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari inspirasi..."
              className="w-full bg-transparent text-sm outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3" ref={notifRef}>
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-4 top-14 w-80 bg-white rounded-2xl shadow-xl border">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 flex gap-3 hover:bg-gray-50">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                    {n.type === 'money' && <DollarSign className="w-4 h-4" />}
                    {n.type === 'like' && <Heart className="w-4 h-4" />}
                    {n.type === 'system' && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm">{n.text}</p>
                    <p className="text-xs text-gray-400">{n.time} lalu</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-2 rounded-full hover:bg-gray-100">
            <MessageCircle className="w-5 h-5" />
          </button>

          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}