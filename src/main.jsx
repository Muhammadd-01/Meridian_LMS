import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'
import { readJSON, STORAGE_KEYS } from './services/storage'

// Apply the learner's saved reduced-motion preference before first paint.
if (readJSON(STORAGE_KEYS.ui, {})?.reduceMotion) document.documentElement.classList.add('reduce-motion')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
