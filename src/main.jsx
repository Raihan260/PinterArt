import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ArtProvider } from './context/ArtContext' // <--- 1. Import ini

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ArtProvider> {/* <--- 2. Bungkus App dengan ini */}
        <App />
      </ArtProvider>
    </AuthProvider>
  </React.StrictMode>,
)