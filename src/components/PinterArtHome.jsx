import { useState, useEffect } from 'react'
import { Share2, MoreHorizontal, Send, X, Heart, Lock, User } from 'lucide-react'
import { useArt } from '../context/ArtContext'

export default function PinterArtHome() {
  const { pins, unlockPin, toggleLike, toggleSave, toggleFollow, addComment } = useArt()

  const [selectedPinId, setSelectedPinId] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const [toast, setToast] = useState(null) // { message, type }
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  const selectedPin = pins.find(p => p.id === selectedPinId)

  // ESC untuk tutup modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedPinId(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleSendComment = () => {
    if (!commentText.trim()) return
    addComment(selectedPinId, commentText)
    setCommentText('')
    setToast({ message: 'Komentar terkirim', type: 'success' })
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  const handleDownloadHD = () => {
    if (!selectedPin) return
    if (selectedPin.isPremium && !selectedPin.isUnlocked) {
      showToast('Buka langganan untuk mengunduh HD', 'warning')
      return
    }
    const url = selectedPin.downloadUrl || selectedPin.src
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = selectedPin.title || 'pinterart'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showToast('Mengunduh versi HD...', 'success')
    } catch (_) {
      showToast('Gagal mengunduh', 'error')
    }
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${selectedPinId ? 'overflow-hidden h-screen' : ''}`}>

      {/* --- FEED --- */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5 space-y-4">
          {pins.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              onClick={() => setSelectedPinId(pin.id)}
              onSave={(e) => {
                e.stopPropagation()
                toggleSave(pin.id)
              }}
              onLike={(e) => {
                e.stopPropagation()
                toggleLike(pin.id)
              }}
            />
          ))}
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedPin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setSelectedPinId(null)}
        >
          <div
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedPinId(null)}
              className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full md:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative">
              <img
                src={selectedPin.src}
                alt={selectedPin.title}
                className={`max-w-full max-h-full object-contain ${
                  selectedPin.isPremium && !selectedPin.isUnlocked
                    ? 'blur-xl scale-110 opacity-50'
                    : ''
                }`}
              />

              {selectedPin.isPremium && !selectedPin.isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <Lock className="w-16 h-16 mb-4 opacity-80" />
                  <h2 className="text-2xl font-bold mb-2">Konten Eksklusif</h2>
                  <p className="text-gray-300 max-w-xs">
                    Berlangganan ke artist ini untuk membuka konten penuh.
                  </p>
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
              <div className="p-6 flex justify-between items-center">
                <div className="flex gap-2 relative">
                  <button
                    onClick={() => {
                      const shareData = {
                        title: selectedPin.title,
                        text: `Lihat karya ${selectedPin.artist}`,
                        url: window.location.href,
                      }
                      if (navigator.share) {
                        navigator.share(shareData).catch(() => {})
                      } else {
                        navigator.clipboard?.writeText(shareData.url)
                        showToast('Link disalin ke clipboard', 'success')
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setMoreOpen(v => !v)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          setMoreOpen(false)
                          handleDownloadHD()
                        }}
                      >
                        Download HD
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          setMoreOpen(false)
                          navigator.clipboard?.writeText(window.location.href)
                          showToast('Link disalin ke clipboard', 'success')
                        }}
                      >
                        Salin Link
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          setMoreOpen(false)
                          showToast('Terima kasih, laporan Anda kami catat', 'info')
                        }}
                      >
                        Laporkan
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleSave(selectedPin.id)}
                    className={`px-5 py-3 rounded-full font-semibold ${
                      selectedPin.isSaved ? 'bg-black text-white' : 'bg-gray-200'
                    }`}
                  >
                    {selectedPin.isSaved ? 'Disimpan' : 'Simpan'}
                  </button>

                  <button
                    onClick={() => {
                      if (selectedPin.isPremium && !selectedPin.isUnlocked) {
                        setSubscribeOpen(true)
                      } else {
                        handleDownloadHD()
                      }
                    }}
                    className="px-5 py-3 rounded-full font-bold text-white bg-black"
                  >
                    {selectedPin.isPremium && !selectedPin.isUnlocked
                      ? 'Langganan'
                      : 'Download HD'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6">
                <h1 className="text-3xl font-bold mb-2">{selectedPin.title}</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-700">{selectedPin.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFollow(selectedPin.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        selectedPin.isFollowing ? 'bg-black text-white' : 'bg-gray-200'
                      }`}
                    >
                      {selectedPin.isFollowing ? 'Mengikuti' : 'Ikuti'}
                    </button>
                    <button
                      onClick={() => toggleLike(selectedPin.id)}
                      className={`p-2 rounded-full border ${selectedPin.isLiked ? 'bg-red-100 border-red-300' : 'bg-white border-gray-200'} hover:bg-red-50`}
                      title={selectedPin.isLiked ? 'Batalkan Suka' : 'Suka'}
                    >
                      <Heart className={`w-5 h-5 ${selectedPin.isLiked ? 'text-red-600' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  {selectedPin.description || 'Tidak ada deskripsi.'}
                </p>

                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">
                    {selectedPin.comments.length} Komentar
                  </h3>

                  {selectedPin.comments.map((c, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <p className="text-sm">
                        <b>{c.name}</b> {c.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                    placeholder="Tambahkan komentar..."
                    className="bg-transparent flex-1 outline-none text-sm"
                  />
                  <button onClick={handleSendComment}>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {subscribeOpen && selectedPin && (
        <SubscribeModal
          pin={selectedPin}
          onClose={() => setSubscribeOpen(false)}
          onConfirm={() => {
            unlockPin(selectedPin.id)
            setSubscribeOpen(false)
            showToast('Berlangganan berhasil! Konten terbuka.', 'success')
          }}
        />
      )}
      <Toast toast={toast} />
    </div>
  )
}

function PinCard({ pin, onClick, onSave, onLike }) {
  const isLocked = pin.isPremium && !pin.isUnlocked

  return (
    <div onClick={onClick} className="cursor-pointer break-inside-avoid">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src={pin.src}
          alt={pin.title}
          className={`w-full object-cover ${
            isLocked ? 'blur-md brightness-75' : ''
          }`}
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-white">
              <div className="bg-black/40 rounded-full p-3 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded-full">Konten Premium</span>
            </div>
          </div>
        )}
        {!isLocked && (
          <div className="absolute inset-x-0 top-0 p-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onSave}
              className="px-3 py-1.5 text-xs bg-black text-white rounded-full shadow"
            >
              {pin.isSaved ? 'Disimpan' : 'Simpan'}
            </button>
            <button
              onClick={onLike}
              className={`p-2 rounded-full bg-white/90 shadow ${pin.isLiked ? 'text-red-600' : 'text-gray-700'}`}
              title={pin.isLiked ? 'Batalkan Suka' : 'Suka'}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        )}
        {typeof pin.likeCount === 'number' && !isLocked && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs bg-white/90 shadow flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-600" />
            <span className="text-gray-700">{pin.likeCount}</span>
          </div>
        )}
      </div>
      <p className="mt-2 font-bold text-sm">{pin.title}</p>
    </div>
  )
}

function SubscribeModal({ pin, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Langganan Konten Eksklusif</h2>
              <p className="text-sm text-gray-600">Artist: {pin.artist}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-700">Buka akses penuh untuk karya ini dan konten premium dari artist.</p>
            <ul className="mt-3 text-sm text-gray-700 list-disc pl-4 space-y-1">
              <li>Gambar kualitas HD tanpa blur</li>
              <li>Akses komentar premium</li>
              <li>Update eksklusif dari artist</li>
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Biaya langganan</p>
              <p className="text-xl font-bold">Rp 50.000</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-900 font-semibold" onClick={onClose}>Batal</button>
              <button className="px-4 py-2 rounded-full bg-black text-white font-bold" onClick={onConfirm}>Berlangganan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Lightweight toast
function Toast({ toast }) {
  if (!toast) return null
  const color = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-yellow-600' : 'bg-gray-800'
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${color} text-white px-4 py-2 rounded-full shadow-lg z-[60]`}>{toast.message}</div>
  )
}