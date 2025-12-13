import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // State User (null = belum login, object = sudah login)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Init dari localStorage jika tersedia
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pinterart:user')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed)
      }
    } catch {}
  }, [])

  // Fungsi Login (Simulasi)
  const signIn = async (data) => {
    setLoading(true)
    setError(null)
    // Simulasi delay server
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email) {
          const mockUser = { 
            username: data.email.split('@')[0], 
            email: data.email, 
            mode: 'Login',
            bio: '',
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email.split('@')[0]}`
          }
          setUser(mockUser)
          try { localStorage.setItem('pinterart:user', JSON.stringify(mockUser)) } catch {}
          resolve(mockUser)
        } else {
          setError("Email/Password salah")
          reject("Error")
        }
        setLoading(false)
      }, 1000)
    })
  }

  // Fungsi Register (Simulasi)
  const signUp = async (data) => {
    setLoading(true)
    setError(null)
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { 
          username: data.username, 
          email: data.email, 
          mode: 'Register',
          bio: '',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username || 'artist'}`
        }
        setUser(mockUser)
        try { localStorage.setItem('pinterart:user', JSON.stringify(mockUser)) } catch {}
        resolve(mockUser)
        setLoading(false)
      }, 1000)
    })
  }

  // --- FUNGSI LOGOUT BARU ---
  const logout = () => {
    setUser(null) // Hapus data user
    try { localStorage.removeItem('pinterart:user') } catch {}
  }

  // --- FUNGSI UPDATE PROFIL ---
  const updateProfile = (data) => {
    setUser((prev) => {
      const next = { 
        ...prev, 
        username: data.username ?? prev?.username, 
        bio: data.bio ?? prev?.bio, 
        avatarUrl: data.avatarUrl ?? prev?.avatarUrl 
      }
      try { localStorage.setItem('pinterart:user', JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, updateProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)