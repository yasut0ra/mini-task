import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // このファイルに Tailwind のディレクティブが含まれていることを確認
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
