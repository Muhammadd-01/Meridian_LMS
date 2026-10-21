import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header, { DemoBanner } from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

export default function PublicLayout() {
  const { signedOut, acknowledgeSignOut } = useAuth()
  useEffect(() => {
    if (signedOut) acknowledgeSignOut()
  }, [signedOut, acknowledgeSignOut])

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
