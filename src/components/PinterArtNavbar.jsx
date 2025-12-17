import { useState, useEffect, useRef } from 'react'
import { Bell, MessageCircle, User, Search, X, Heart, CheckCircle, DollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { pathname } = useLocation()

  const isHome = pathname.startsWith('/main')
  const isCreate = pathname.startsWith('/create')
  const isCommunity = pathname.startsWith('/community')

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatSearch, setChatSearch] = useState('')
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [draftMessage, setDraftMessage] = useState('')

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

  // Mock chat threads and messages
  const [threads, setThreads] = useState([
    { id: 1, name: 'Sarah Arts', last: 'Keren banget!', unread: 2 },
    { id: 2, name: 'Budi Design', last: 'Siap, nanti saya kirim.', unread: 0 },
    { id: 3, name: 'Studio Neon', last: 'Kolaborasi minggu depan?', unread: 1 },
  ])

  const [messagesByThread, setMessagesByThread] = useState({
    1: [
      { id: 'm1', from: 'them', text: 'Keren banget!', time: '10:21' },
      { id: 'm2', from: 'me', text: 'Terima kasih! 😊', time: '10:22' },
    ],
    2: [
      { id: 'm3', from: 'them', text: 'Siap, nanti saya kirim.', time: '09:05' },
    ],
    3: [
      { id: 'm4', from: 'them', text: 'Kolaborasi minggu depan?', time: '08:40' },
    ],
  })

  useEffect(() => {
    // Open first thread by default when chat opens
    if (isChatOpen && activeThreadId == null && threads.length) {
      setActiveThreadId(threads[0].id)
    }
  }, [isChatOpen])

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

          {/* KOMUNITAS */}
          <Link
            to="/community"
            className={`${baseTab} ${isCommunity ? activeTab : inactiveTab}`}
          >
            Komunitas
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

          {isChatOpen && (
            <div ref={chatRef} className="absolute right-14 top-14 w-[680px] max-w-[90vw] bg-white rounded-2xl shadow-xl border overflow-hidden">
              <div className="grid grid-cols-5">
                {/* Sidebar Threads */}
                <div className="col-span-2 border-r bg-gray-50">
                  <div className="p-3">
                    <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        placeholder="Cari chat..."
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {threads
                      .filter(t => t.name.toLowerCase().includes(chatSearch.toLowerCase()))
                      .map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveThreadId(t.id)}
                          className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-100 ${activeThreadId === t.id ? 'bg-gray-100' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div>
                              <p className="text-sm font-semibold">{t.name}</p>
                              <p className="text-xs text-gray-600 truncate max-w-[160px]">{t.last}</p>
                            </div>
                          </div>
                          {t.unread > 0 && (
                            <span className="text-xs bg-black text-white rounded-full px-2 py-0.5">{t.unread}</span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Main Chat */}
                <div className="col-span-3 flex flex-col h-[420px]">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div>
                        <p className="text-sm font-semibold">{threads.find(t => t.id === activeThreadId)?.name || 'Chat'}</p>
                        <p className="text-xs text-gray-500">Online</p>
                      </div>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsChatOpen(false)}>Tutup</button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
                    {(messagesByThread[activeThreadId] || []).map(m => (
                      <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${m.from === 'me' ? 'bg-black text-white' : 'bg-gray-100'} rounded-2xl px-3 py-2 text-sm max-w-[70%]`}>
                          {m.text}
                          <span className="block text-[10px] opacity-60 mt-0.5">{m.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Composer */}
                  <div className="p-3 border-t bg-gray-50">
                    <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2">
                      <input
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && draftMessage.trim()) {
                            const id = Date.now().toString()
                            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            const msg = { id, from: 'me', text: draftMessage.trim(), time }
                            setMessagesByThread(prev => ({
                              ...prev,
                              [activeThreadId]: [...(prev[activeThreadId] || []), msg]
                            }))
                            setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, last: msg.text, unread: 0 } : t))
                            setDraftMessage('')
                          }
                        }}
                        placeholder="Tulis pesan..."
                        className="w-full bg-transparent text-sm outline-none"
                      />
                      <button
                        className="px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold"
                        onClick={() => {
                          if (!draftMessage.trim()) return
                          const id = Date.now().toString()
                          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          const msg = { id, from: 'me', text: draftMessage.trim(), time }
                          setMessagesByThread(prev => ({
                            ...prev,
                            [activeThreadId]: [...(prev[activeThreadId] || []), msg]
                          }))
                          setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, last: msg.text, unread: 0 } : t))
                          setDraftMessage('')
                        }}
                      >Kirim</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}