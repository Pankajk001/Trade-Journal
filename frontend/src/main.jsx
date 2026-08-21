import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { TradeProvider } from './context/TradeContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TradeProvider>
          <App />
        </TradeProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
