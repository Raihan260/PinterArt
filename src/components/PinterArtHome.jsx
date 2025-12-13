import { useState, useEffect, useRef } from 'react'
import { Bell, MessageCircle, User, Search, Share2, MoreHorizontal, Send, X, Heart, Lock, CheckCircle, DollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useArt } from '../context/ArtContext'

export default function PinterArtHome() {
  const { pathname } = useLocation()
  const isFeed = pathname.startsWith('/feed') || pathname === '/'
  const isCreate = pathname.startsWith('/create')
  
  const { pins, unlockPin, toggleLike, toggleSave, toggleFollow, addComment } = useArt() 
  
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPinId, setSelectedPinId] = useState(null)
  const [commentText, setCommentText] = useState('')
  
  // State Baru: Notifikasi
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef(null) // Untuk mendeteksi klik di luar dropdown

    // State Baru: Chat
    const [isChatOpen, setIsChatOpen] = useState(false)
    const chatRef = useRef(null)
    const [chatText, setChatText] = useState('')
    const [chatMessages, setChatMessages] = useState([
        { id: 1, name: 'Sarah Arts', text: 'Halo! Karyamu keren banget 👀', time: '1m' },
        { id: 2, name: 'Budi Design', text: 'Ada collab minggu depan?', time: '10m' },
        { id: 3, name: 'System', text: 'Ingat untuk patuhi pedoman komunitas.', time: '1h' }
    ])

  // Mock Data Notifikasi (Biar terlihat ramai)
  const notifications = [
      { id: 1, type: 'money', text: 'Seseorang berlangganan karyamu!', time: '2m', amount: '+Rp 50.000', read: false },
      { id: 2, type: 'like', text: 'Sarah Arts menyukai "Cyberpunk City"', time: '1j', read: true },
      { id: 3, type: 'follow', text: 'Budi Design mulai mengikuti Anda', time: '3j', read: true },
      { id: 4, type: 'system', text: 'Selamat datang di PinterArt Premium!', time: '1h', read: true },
  ]

  const filteredPins = pins.filter(pin => 
    pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pin.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedPin = pins.find(p => p.id === selectedPinId)

  // Tutup Modal & Notifikasi saat tombol ESC ditekan
  useEffect(() => {
    const handleEsc = (e) => { 
        if (e.key === 'Escape') {
            setSelectedPinId(null)
            setIsNotifOpen(false)
            setIsChatOpen(false)
        }
    }
    // Tutup notifikasi jika klik di luar area
    const handleClickOutside = (e) => {
        if (notifRef.current && !notifRef.current.contains(e.target)) {
            setIsNotifOpen(false)
        }
        if (chatRef.current && !chatRef.current.contains(e.target)) {
            setIsChatOpen(false)
        }
    }

    window.addEventListener('keydown', handleEsc)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
        window.removeEventListener('keydown', handleEsc)
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSendComment = () => {
    if (!commentText.trim()) return
    addComment(selectedPinId, commentText)
    setCommentText('') 
  }

    const handleSendChat = () => {
        const text = chatText.trim()
        if (!text) return
        const newMsg = { id: Date.now(), name: 'Anda', text, time: 'now' }
        setChatMessages((prev) => [...prev, newMsg])
        setChatText('')
    }

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${selectedPinId ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* --- NAVBAR --- */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 relative">
          <div className="flex items-center">
            <span className="text-brand text-xl font-bold tracking-tight text-red-600">PinterArt</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Link to="/feed" className={`rounded-full px-3 py-1.5 text-sm font-medium ${isFeed ? 'bg-black text-white' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}>Beranda</Link>
            <Link to="/create" className={`rounded-full px-3 py-1.5 text-sm font-medium ${isCreate ? 'bg-black text-white' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}>Buat</Link>
          </div>
          
          <div className="mx-2 flex-1">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-2 hover:bg-gray-200 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5">
              <Search className="h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari inspirasi..." 
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500" 
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-200 rounded-full"><X className="h-3 w-3 text-gray-500" /></button>}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3" ref={notifRef}>
            
            {/* BUTTON NOTIFIKASI */}
            <div className="relative">
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`rounded-full p-2 transition relative ${isNotifOpen ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <Bell className="h-5 w-5" />
                    {/* Badge Merah (Titik) */}
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
                </button>

                {/* --- DROPDOWN NOTIFIKASI --- */}
                {isNotifOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-sm">Update Terbaru</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notif) => (
                                <div key={notif.id} className={`p-4 flex gap-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                    {/* Icon Berdasarkan Tipe */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                                        ${notif.type === 'money' ? 'bg-green-100 text-green-600' : 
                                          notif.type === 'like' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {notif.type === 'money' && <DollarSign className="w-5 h-5" />}
                                        {notif.type === 'like' && <Heart className="w-5 h-5" />}
                                        {notif.type === 'follow' && <User className="w-5 h-5" />}
                                        {notif.type === 'system' && <CheckCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900 leading-snug">
                                            {notif.text} 
                                            {notif.amount && <span className="font-bold text-green-600 ml-1">{notif.amount}</span>}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{notif.time} yang lalu</p>
                                    </div>
                                    {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 text-center">
                            <button className="text-xs font-semibold text-gray-500 hover:text-black py-2">Lihat Semua</button>
                        </div>
                    </div>
                )}
            </div>

                        <button 
                            onClick={() => setIsChatOpen((v) => !v)}
                            className={`rounded-full p-2 transition ${isChatOpen ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <MessageCircle className="h-5 w-5" />
                        </button>
            
            <Link to="/profile" className="rounded-full p-2 hover:bg-gray-100 text-gray-900">
                <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- FEED --- */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10">
        {filteredPins.length > 0 ? (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5 space-y-4">
            {filteredPins.map((pin) => (
                <PinCard 
                    key={pin.id} 
                    pin={pin} 
                    onClick={() => setSelectedPinId(pin.id)} 
                    onSave={(e) => { e.stopPropagation(); toggleSave(pin.id); }} 
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Tidak ditemukan hasil untuk "{searchQuery}"</p>
                <p className="text-gray-400 text-sm">Coba kata kunci lain atau periksa ejaanmu.</p>
            </div>
        )}
      </div>

            {/* --- CHAT DRAWER --- */}
            {isChatOpen && (
                <div className="fixed right-4 top-20 z-50" ref={chatRef}>
                    <div className="w-[360px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold">Pesan Komunitas</p>
                                <p className="text-xs text-gray-500">Terhubung dengan para artist</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="h-80 overflow-y-auto p-4 space-y-3">
                            {chatMessages.map((m) => (
                                <div key={m.id} className="flex items-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="avatar" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-0.5">{m.name} · {m.time}</p>
                                        <div className={`inline-block px-3 py-2 rounded-2xl text-sm ${m.name === 'Anda' ? 'bg-black text-white' : 'bg-gray-100'}`}>{m.text}</div>
                                    </div>
                                </div>
                            ))}
                            {chatMessages.length === 0 && (
                                <p className="text-xs text-gray-400">Belum ada pesan.</p>
                            )}
                        </div>
                        <div className="p-3 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                                <input 
                                    type="text" 
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder="Tulis pesan..." 
                                    className="bg-transparent flex-1 outline-none text-sm" 
                                />
                                <button onClick={handleSendChat} className="p-1 rounded-full hover:bg-gray-200">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

      {/* --- DETAIL MODAL --- */}
      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8" onClick={() => setSelectedPinId(null)}>
            <div 
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()} 
            >
                <button onClick={() => setSelectedPinId(null)} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full md:hidden">
                    <X className="w-6 h-6" />
                </button>

                {/* KIRI: Gambar */}
                <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden group">
                    <img 
                        src={selectedPin.src} 
                        alt={selectedPin.title} 
                        className={`max-w-full max-h-full object-contain transition-all duration-500 ${selectedPin.isPremium && !selectedPin.isUnlocked ? 'blur-xl scale-110 opacity-50' : ''}`} 
                    />
                    {selectedPin.isPremium && !selectedPin.isUnlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white p-6 text-center">
                            <Lock className="w-16 h-16 mb-4 opacity-80" />
                            <h2 className="text-2xl font-bold mb-2">Konten Eksklusif</h2>
                            <p className="text-gray-300 max-w-xs">Berlangganan ke artist ini untuk melihat versi penuh tanpa sensor.</p>
                        </div>
                    )}
                </div>

                {/* KANAN: Detail & Interaksi */}
                <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
                    <div className="p-6 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-transparent">
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 className="w-5 h-5" /></button>
                            <button className="p-2 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => toggleSave(selectedPin.id)}
                                className={`px-5 py-3 rounded-full font-semibold transition ${selectedPin.isSaved ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                {selectedPin.isSaved ? 'Disimpan' : 'Simpan'}
                            </button>
                            
                            <button 
                                onClick={() => {
                                    if(selectedPin.isPremium && !selectedPin.isUnlocked) {
                                        if(confirm(`Langganan ke ${selectedPin.artist} seharga Rp 50.000?`)) {
                                            unlockPin(selectedPin.id)
                                        }
                                    }
                                }}
                                className={`px-5 py-3 rounded-full font-bold text-white transition shadow-md flex items-center gap-2 
                                ${selectedPin.isPremium && !selectedPin.isUnlocked ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-black hover:bg-gray-800'}`}>
                                
                                {selectedPin.isPremium && !selectedPin.isUnlocked ? (
                                    <> <Lock className="w-4 h-4" /> Langganan Rp 50rb </>
                                ) : ( 'Download HD' )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-8">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            {selectedPin.title}
                            {selectedPin.isPremium && <Lock className="w-6 h-6 text-gray-400" />}
                        </h1>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed whitespace-pre-wrap">{selectedPin.description || "Tidak ada deskripsi."}</p>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={selectedPin.avatar} alt="avatar" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{selectedPin.artist}</p>
                                    <p className="text-xs text-gray-500">Artist PinterArt</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFollow(selectedPin.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedPin.isFollowed ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {selectedPin.isFollowed ? 'Diikuti' : 'Ikuti'}
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
                                {selectedPin.comments.length} Komentar
                                <button onClick={() => toggleLike(selectedPin.id)} className="flex items-center gap-1 text-sm font-normal">
                                    <Heart className={`w-5 h-5 ${selectedPin.isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                                    {selectedPin.isLiked ? 'Anda menyukai ini' : 'Suka'}
                                </button>
                            </h3>
                            <div className="space-y-4">
                                {selectedPin.comments.map((c, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mt-1">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} alt="user" className="w-full h-full"/>
                                        </div>
                                        <div>
                                            <p className="text-sm"><span className="font-semibold">{c.name}</span> <span className="text-gray-600">{c.text}</span></p>
                                        </div>
                                    </div>
                                ))}
                                {selectedPin.comments.length === 0 && <p className="text-gray-400 text-sm">Belum ada komentar.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
                         <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden"><User className="w-full h-full p-1 text-white" /></div>
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                placeholder="Tambahkan komentar..." 
                                className="bg-transparent flex-1 outline-none text-sm" 
                            />
                            <button onClick={handleSendComment} className="p-1 hover:text-red-600"><Send className="w-5 h-5" /></button>
                         </div>
                    </div>
                </div>
            </div>
            <button onClick={() => setSelectedPinId(null)} className="hidden md:block absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition"><X className="w-8 h-8" /></button>
        </div>
      )}
    </div>
  )
}

function PinCard({ pin, onClick, onSave }) {
  const isLocked = pin.isPremium && !pin.isUnlocked
  return (
    <div className="relative mb-4 break-inside-avoid cursor-pointer" onClick={onClick}>
      <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
        <img src={pin.src} alt={pin.title} className={`w-full object-cover transition-all duration-500 ${isLocked ? 'blur-md scale-105 brightness-75' : ''}`} loading="lazy" />
        
        {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="bg-black/60 p-3 rounded-full backdrop-blur-sm mb-2"><Lock className="w-6 h-6 text-white" /></div>
                <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-1 rounded">Supporter Only</span>
            </div>
        )}

        {!isLocked && (
            <div className="absolute right-3 top-3 hidden group-hover:block">
                <button onClick={onSave} className={`pointer-events-auto inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700 ${pin.isSaved ? 'bg-black' : 'bg-red-600'}`}>
                    {pin.isSaved ? 'Disimpan' : 'Simpan'}
                </button>
            </div>
        )}
      </div>
      <p className="mt-2 text-sm font-bold text-gray-900 px-1 truncate flex items-center gap-1">
          {pin.isPremium && <Lock className="w-3 h-3 text-gray-500" />} {pin.title}
      </p>
      <div className="flex items-center gap-1 px-1 mt-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden"><img src={pin.avatar} alt="avatar"/></div>
          <p className="text-[10px] text-gray-500">{pin.artist}</p>
      </div>
    </div>
  )
}