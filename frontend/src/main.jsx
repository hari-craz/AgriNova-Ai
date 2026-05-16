import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#051a0e',
            color: '#e5e7eb',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '14px'
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#051a0e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
