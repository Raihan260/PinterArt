import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom' // Tambah useNavigate
import { ArrowLeft, Settings, Share2, Lock, BarChart3, LogOut } from 'lucide-react' // Tambah icon LogOut
import { useArt } from '../context/ArtContext'
import { useAuth } from '../context/AuthContext' // Import AuthContext

export default function PinterArtProfile() {
  const { pins } = useArt()
  
  // Ambil user dan fungsi logout dari AuthContext
    const { user, logout, updateProfile } = useAuth ? useAuth() : { user: null, logout: () => {}, updateProfile: undefined }
    const navigate = useNavigate()
    const location = useLocation()

  const [activeTab, setActiveTab] = useState('created')
    const [isEditing, setIsEditing] = useState(false)
    const [profileDraft, setProfileDraft] = useState({
        username: user?.username || 'Raihan Artist',
        bio: 'Digital Artist yang suka menggambar kucing dan suasana Cyberpunk.\nBerlangganan untuk melihat proses kreatifku! 🎨✨',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    })

    // Guard: redirect jika belum login
    useEffect(() => {
        if (!user) {
            navigate('/auth', { replace: true, state: { from: location.pathname } })
        }
    }, [user, navigate, location])

    const createdPins = pins.filter(pin => pin.artist === 'Saya (Artist)' || pin.artist === 'Saya Sendiri')
  const savedPins = pins.filter(pin => pin.isSaved)
  const displayPins = activeTab === 'created' ? createdPins : savedPins

  // Fungsi Handler Logout
  const handleLogout = () => {
    if (confirm('Yakin ingin keluar?')) {
        logout()      // 1. Hapus data user
        navigate('/') // 2. Lempar ke halaman Login
    }
  }

    const handleStartEdit = () => {
        setProfileDraft({
            username: user?.username || profileDraft.username,
            bio: user?.bio || profileDraft.bio,
            avatarUrl: user?.avatarUrl || profileDraft.avatarUrl
        })
        setIsEditing(true)
    }

    const handleSaveProfile = () => {
        const data = { 
            username: profileDraft.username?.trim() || 'Artist',
            bio: profileDraft.bio?.trim() || '',
            avatarUrl: profileDraft.avatarUrl?.trim() || ''
        }
        if (typeof updateProfile === 'function') {
            updateProfile(data)
        }
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setProfileDraft({
            username: user?.username || 'Raihan Artist',
            bio: user?.bio || 'Digital Artist yang suka menggambar kucing dan suasana Cyberpunk.\nBerlangganan untuk melihat proses kreatifku! 🎨✨',
            avatarUrl: user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        })
    }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      
      {/* Header Nav */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <Link to="/feed" className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6" /></Link>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 className="w-5 h-5" /></button>
            
            {/* Tombol Logout di Header (Opsional/Shortcut) */}
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-red-600 rounded-full">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Info Profil */}
      <div className="flex flex-col items-center pt-8 pb-8 px-4 text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 border-2 border-white shadow-sm">
            <img src={isEditing ? profileDraft.avatarUrl : (user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')} alt="Profile" className="w-full h-full object-cover" />
        </div>
        
        {/* Tampilkan Nama User Asli dari Login (Jika ada) */}
                {!isEditing ? (
                    <>
                        <h1 className="text-3xl font-bold mb-1">{user?.username || 'Raihan Artist'}</h1>
                        <p className="text-gray-500 text-sm mb-4">@{(user?.username || 'raihan_art').toLowerCase().replace(/\s/g, '_')} • 0 Pengikut • 0 Mengikuti</p>
                        <p className="text-gray-900 max-w-md text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                            {user?.bio || 'Digital Artist yang suka menggambar kucing dan suasana Cyberpunk.\nBerlangganan untuk melihat proses kreatifku! 🎨✨'}
                        </p>
                    </>
                ) : (
                    <div className="w-full max-w-md text-left space-y-3 mb-6">
                        <label className="block">
                            <span className="text-xs text-gray-500">Nama Pengguna</span>
                            <input 
                                type="text" 
                                value={profileDraft.username}
                                onChange={(e) => setProfileDraft((p) => ({ ...p, username: e.target.value }))}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                        </label>
                        <label className="block">
                            <span className="text-xs text-gray-500">Bio</span>
                            <textarea
                                rows={4}
                                value={profileDraft.bio}
                                onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                        </label>
                        <label className="block">
                            <span className="text-xs text-gray-500">Avatar URL</span>
                            <input 
                                type="url" 
                                value={profileDraft.avatarUrl}
                                onChange={(e) => setProfileDraft((p) => ({ ...p, avatarUrl: e.target.value }))}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                        </label>
                    </div>
                )}
        
        <div className="flex flex-wrap justify-center gap-2">
            <Link to="/dashboard" className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
                <BarChart3 className="w-4 h-4" />
                Creator Studio
            </Link>
            
                        {!isEditing ? (
                            <button onClick={handleStartEdit} className="bg-gray-100 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition">Edit Profil</button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleSaveProfile} className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition">Simpan</button>
                                <button onClick={handleCancelEdit} className="bg-gray-100 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition">Batal</button>
                            </div>
                        )}
            
            {/* Tombol Logout Utama */}
            <button 
                onClick={handleLogout}
                className="bg-gray-100 text-red-600 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-red-50 transition border border-transparent hover:border-red-100"
            >
                Keluar
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-6 border-b border-gray-100">
        <button 
            onClick={() => setActiveTab('created')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'created' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
            Dibuat
        </button>
        <button 
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
            Disimpan
        </button>
      </div>

      {/* Grid Content */}
      <div className="mx-auto max-w-7xl px-4">
        {displayPins.length > 0 ? (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
                {displayPins.map((pin) => (
                    <div key={pin.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-gray-100 mb-4">
                        <img 
                            src={pin.src} 
                            alt={pin.title} 
                            className={`w-full object-cover ${pin.isPremium && !pin.isUnlocked ? 'blur-sm' : ''}`}
                        />
                        {pin.isPremium && (
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-md">
                                <Lock className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold truncate">{pin.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-400">
                <p>Belum ada Pin di sini.</p>
                {activeTab === 'saved' && <Link to="/feed" className="text-black underline text-sm mt-2 block">Mulai Menjelajah</Link>}
                {activeTab === 'created' && <Link to="/create" className="text-black underline text-sm mt-2 block">Buat Pin Baru</Link>}
            </div>
        )}
      </div>

    </div>
  )
}