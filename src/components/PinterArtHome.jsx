import { useState, useEffect } from 'react'
import { Share2, MoreHorizontal, Send, X, Heart, Lock, User } from 'lucide-react'
import { useArt } from '../context/ArtContext'

export default function PinterArtHome() {
  const { pins, unlockPin, toggleLike, toggleSave, toggleFollow, addComment } = useArt()

  const [selectedPinId, setSelectedPinId] = useState(null)
  const [commentText, setCommentText] = useState('')

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
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
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
                        if (confirm(`Langganan ke ${selectedPin.artist} seharga Rp 50.000?`)) {
                          unlockPin(selectedPin.id)
                        }
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
    </div>
  )
}

function PinCard({ pin, onClick, onSave }) {
  const isLocked = pin.isPremium && !pin.isUnlocked

  return (
    <div onClick={onClick} className="cursor-pointer break-inside-avoid">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={pin.src}
          alt={pin.title}
          className={`w-full object-cover ${
            isLocked ? 'blur-md brightness-75' : ''
          }`}
        />
        {!isLocked && (
          <button
            onClick={onSave}
            className="absolute top-3 right-3 px-3 py-1.5 text-xs bg-red-600 text-white rounded-full"
          >
            Simpan
          </button>
        )}
      </div>
      <p className="mt-2 font-bold text-sm">{pin.title}</p>
    </div>
  )
}