import { useEffect, useState } from 'react'
import { ImagePlus, X, Lock, Unlock } from 'lucide-react' // Ganti icon Dollar jadi Lock
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useArt } from '../context/ArtContext'
import { useAuth } from '../context/AuthContext'

export default function PinterArtCreate() {
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Ganti isSelling/Price menjadi isPremium
  const [isPremium, setIsPremium] = useState(false) 
  
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const { addPin } = useArt()
  const navigate = useNavigate()
    const { user } = useAuth()
    const location = useLocation()

    useEffect(() => {
        if (!user) {
            navigate('/auth', { replace: true, state: { from: location.pathname } })
        }
    }, [user, navigate, location])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
    }
  }

  const handlePublish = () => {
    if (!selectedImage) return alert("Pilih gambar dulu!")

    const newPin = {
        id: Date.now(),
        src: selectedImage,
        title: title || 'Karya Baru',
        description: desc,
        
        // --- LOGIKA BARU ---
        isPremium: isPremium, // Status konten
        artist: 'Saya (Artist)', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        // Kita anggap user yang upload pasti bisa lihat karyanya sendiri
        isUnlocked: true 
    }

    addPin(newPin)
    navigate('/feed')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Buat Karya</h1>
            <Link to="/feed" className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- KOLOM KIRI: PREVIEW GAMBAR --- */}
            <div className="w-full lg:w-[400px] flex-shrink-0">
                <div className="bg-gray-100 rounded-[32px] overflow-hidden relative aspect-[3/4] flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition cursor-pointer">
                    {selectedImage ? (
                        <div className="relative w-full h-full group">
                            {/* Simulasi Efek Blur jika Premium dipilih */}
                            <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className={`w-full h-full object-cover transition-all duration-300 ${isPremium ? 'blur-sm brightness-75' : ''}`} 
                            />
                            
                            {/* Ikon Gembok Preview */}
                            {isPremium && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/50 p-3 rounded-full backdrop-blur-md">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setSelectedImage(null)} className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 z-10"><X className="w-5 h-5" /></button>
                        </div>
                    ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6 text-center">
                            <div className="bg-gray-200 p-4 rounded-full mb-4"><ImagePlus className="w-8 h-8 text-gray-600" /></div>
                            <p className="text-sm font-medium text-gray-700">Pilih file karya</p>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    )}
                </div>
                {isPremium && selectedImage && (
                    <p className="text-center text-xs text-gray-500 mt-2">Preview: Ini tampilan bagi user yang belum subscribe.</p>
                )}
            </div>

            {/* --- KOLOM KANAN: FORM DETAIL --- */}
            <div className="flex-1 space-y-6 w-full">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Judul</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Berikan judul menarik" className="w-full text-3xl font-bold placeholder:text-gray-300 border-none focus:ring-0 p-0 outline-none"/>
                    <div className="h-px w-full bg-gray-200 mt-2"></div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Deskripsi & Cerita di balik layar</label>
                    <textarea rows="4" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ceritakan tentang karya ini..." className="w-full text-base placeholder:text-gray-400 border-none focus:ring-0 p-0 outline-none resize-none"/>
                    <div className="h-px w-full bg-gray-200 mt-2"></div>
                </div>

                {/* --- FITUR MEMBERSHIP (VISIBILITY) --- */}
                <div className="pt-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isPremium ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {isPremium ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {isPremium ? 'Khusus Supporter (Premium)' : 'Publik (Gratis)'}
                                    </h3>
                                    <p className="text-xs text-gray-500 max-w-[200px]">
                                        {isPremium 
                                            ? 'Hanya subscriber yang bisa melihat gambar asli.' 
                                            : 'Semua orang bisa melihat karya ini.'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button 
                                onClick={() => setIsPremium(!isPremium)} 
                                className={`w-12 h-7 rounded-full transition-colors relative ${isPremium ? 'bg-black' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transition-transform ${isPremium ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                     <button onClick={() => navigate('/feed')} className="px-5 py-2.5 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition">Batal</button>
                     <button onClick={handlePublish} className="px-6 py-2.5 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition shadow-sm">
                        {isPremium ? 'Terbitkan (Eksklusif)' : 'Terbitkan (Publik)'}
                     </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}