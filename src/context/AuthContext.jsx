import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // State User (null = belum login, object = sudah login)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fungsi Login (Simulasi)
  const signIn = async (data) => {
    setLoading(true)
    setError(null)
    // Simulasi delay server
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email) {
          const mockUser = { username: data.email.split('@')[0], email: data.email, mode: 'Login' }
          setUser(mockUser)
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
        const mockUser = { username: data.username, email: data.email, mode: 'Register' }
        setUser(mockUser)
        resolve(mockUser)
        setLoading(false)
      }, 1000)
    })
  }

  // --- FUNGSI LOGOUT BARU ---
  const logout = () => {
    setUser(null) // Hapus data user
    // Jika nanti pakai LocalStorage, tambahkan: localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)