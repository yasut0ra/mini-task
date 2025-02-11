import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // このファイルに Tailwind のディレクティブが含まれていることを確認
import App from './App.jsx'
import { ToastProvider } from './contexts/ToastContext'
import { StoreProvider } from './store'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </StoreProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)