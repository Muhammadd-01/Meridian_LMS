import { useEffect, useRef } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ConfirmProvider } from './context/ConfirmContext'
import AppRoutes from './routes/AppRoutes'
import BackToTop from './components/common/BackToTop'
import ChatBot from './components/chat/ChatBot'

/** Scrolls to top and moves focus to the main region after route changes (not on first load). */
function RouteFocusManager() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    const main = document.getElementById('main-content')
    main?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

function SkipLink() {
  return (
    <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-2 font-semibold text-primary shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      Skip to main content
    </a>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <SkipLink />
              <RouteFocusManager />
              <AppRoutes />
              <BackToTop />
              <ChatBot />
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </DataProvider>
    </BrowserRouter>
  )
}
