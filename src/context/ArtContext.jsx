import { createContext, useContext, useState } from 'react'

const ArtContext = createContext()

// 1. DATA DUMMY YANG LEBIH LENGKAP
const INITIAL_PINS = Array.from({ length: 20 }).map((_, i) => {
  const isPremium = i % 3 === 0 
  
  return {
    id: `mock-${i}`,
    src: `/images/${(i % 10) + 1}.jpg`,
    title: isPremium ? `Exclusive Art #${i + 1}` : `Public Art #${i + 1}`,
    description: isPremium ? 'Konten ini khusus untuk supporter setia saya.' : 'Karya ini gratis untuk semua.',
    
    // Status Logic
    isPremium: isPremium,
    isUnlocked: false, // Default terkunci
    isLiked: false,    // Default belum di-like
    isSaved: false,    // Default belum disimpan
    isFollowed: false, // Default belum follow artist ini

    artist: `Artist ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    
    // Array Komentar Kosong
    comments: [
        { name: "User Lain", text: "Keren banget bang!" }
    ] 
  }
})

export function ArtProvider({ children }) {
  const [pins, setPins] = useState(INITIAL_PINS)

  const addPin = (newPin) => {
    // Tambahkan properti default agar tidak error
    const pinWithDefaults = { 
        ...newPin, 
        isLiked: false, 
        isSaved: false, 
        isFollowed: false, 
        comments: [],
        isUnlocked: true // Punya sendiri pasti unlocked
    }
    setPins((prev) => [pinWithDefaults, ...prev])
  }

  // --- FUNGSI-FUNGSI AKSI BARU ---

  // 1. Fungsi Subscribe / Unlock
  const unlockPin = (pinId) => {
    setPins(prev => prev.map(pin => 
        pin.id === pinId ? { ...pin, isUnlocked: true } : pin
    ))
  }

  // 2. Fungsi Like
  const toggleLike = (pinId) => {
    setPins(prev => prev.map(pin => 
        pin.id === pinId ? { ...pin, isLiked: !pin.isLiked } : pin
    ))
  }

  // 3. Fungsi Simpan (Bookmark)
  const toggleSave = (pinId) => {
    setPins(prev => prev.map(pin => 
        pin.id === pinId ? { ...pin, isSaved: !pin.isSaved } : pin
    ))
  }

  // 4. Fungsi Follow Artist (Simulasi per Pin)
  const toggleFollow = (pinId) => {
    setPins(prev => prev.map(pin => 
        pin.id === pinId ? { ...pin, isFollowed: !pin.isFollowed } : pin
    ))
  }

  // 5. Fungsi Komentar
  const addComment = (pinId, text) => {
    const newComment = { name: "Saya (User)", text: text }
    setPins(prev => prev.map(pin => 
        pin.id === pinId ? { ...pin, comments: [...pin.comments, newComment] } : pin
    ))
  }

  return (
    <ArtContext.Provider value={{ 
        pins, 
        addPin, 
        unlockPin, 
        toggleLike, 
        toggleSave, 
        toggleFollow, 
        addComment 
    }}>
      {children}
    </ArtContext.Provider>
  )
}

export const useArt = () => useContext(ArtContext)