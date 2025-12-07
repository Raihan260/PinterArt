import { useEffect, useMemo, useRef, useState } from 'react'
import { Mail, Lock, User, Chrome } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom' // <--- 1. Import ini

export default function PinterArtAuth() {
  const [mode, setMode] = useState('login')
  const { signIn, signUp, loading, error, user } = useAuth()
  const navigate = useNavigate() // <--- 2. Panggil ini

  const images = useMemo(
    () => [
      '/images/1.jpg',
      '/images/2.jpg',
      '/images/3.jpg',
      '/images/4.jpg',
      '/images/5.jpg',
      '/images/6.jpg',
      '/images/7.jpg',
      '/images/8.jpg',
      '/images/9.jpg',
      '/images/10.jpg',
    ],
    []
  )

  const schema = useMemo(() => {
    return mode === 'register'
      ? z.object({
          username: z.string().min(3, 'Minimal 3 karakter'),
          email: z.string().email('Email tidak valid'),
          password: z.string().min(6, 'Minimal 6 karakter'),
        })
      : z.object({
          email: z.string().email('Email tidak valid'),
          password: z.string().min(6, 'Minimal 6 karakter'),
        })
  }, [mode])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset()
  }, [mode, reset])

  // <--- 3. Update fungsi ini
  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        await signIn(data)
      } else {
        await signUp(data)
      }
      // Redirect otomatis ke halaman Feed setelah sukses
      navigate('/feed')
    } catch (e) {
      // Error handled in context
    }
  }

  // auto-scroll for gallery on desktop
  const galleryRef = useRef(null)
  useEffect(() => {
    const el = galleryRef.current
    if (!el) return
    let raf
    let scroll = 0
    const speed = 0.25 
    const loop = () => {
      scroll += speed
      el.scrollTop = scroll
      if (scroll >= el.scrollHeight - el.clientHeight) scroll = 0
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
      {/* Mobile header */}
      <div className="md:hidden relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={images[0]}
            alt="Art"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        </div>
        <div className="relative h-full flex items-end p-4">
          <h1 className="text-white text-2xl font-semibold tracking-tight">PinterArt</h1>
        </div>
      </div>

      <div className="grid w-full min-h-screen md:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden h-full w-full md:block bg-black">
          <div className="absolute inset-0">
            <div ref={galleryRef} className="h-full w-full overflow-hidden overflow-y-auto no-scrollbar">
              <div className="columns-2 xl:columns-3 gap-3 p-4">
                {images.concat(images.slice(0, 4)).concat(images).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Art ${i + 1}`}
                    className="mb-3 w-full break-inside-avoid rounded-lg object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          
          <div className="relative h-full p-12 flex items-end z-10">
            <div className="text-white">
              <h2 className="text-5xl font-bold tracking-tight mb-4">PinterArt.</h2>
              <p className="max-w-md text-lg text-gray-300 leading-relaxed">
                Temukan inspirasi tanpa batas. Simpan ide-ide kreatifmu dan bagikan kepada dunia.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
                <span className="text-2xl font-bold">PinterArt.</span>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {mode === 'login' ? 'Masukan detail akunmu untuk melanjutkan.' : 'Mulai perjalanan kreatifmu hari ini.'}
              </p>
            </div>

            <div className="mb-8 flex p-1 bg-gray-100 rounded-xl">
              <button
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('login')}
              >
                Masuk
              </button>
              <button
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('register')}
              >
                Daftar
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buat username unik" 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-0" 
                        {...register('username')} 
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-600 font-medium">{errors.username.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input 
                    type="email" 
                    placeholder="namamu@email.com" 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-0" 
                    {...register('email')} 
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-0" 
                    {...register('password')} 
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-70 mt-2">
                {loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Buat Akun'}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Atau lanjutkan dengan</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
              >
                <Chrome className="h-5 w-5" />
                Google
              </button>
            </form>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-100">{error}</p>
            )}
            
            <p className="mt-8 text-center text-xs text-gray-400">
              &copy; 2025 PinterArt. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}