import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header, { DemoBanner } from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

export default function PublicLayout() {
  const { signedOut, acknowledgeSignOut } = useAuth()
  const { pathname } = useLocation()
  useEffect(() => {
    if (signedOut) acknowledgeSignOut()
  }, [signedOut, acknowledgeSignOut])

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
