import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { useToast } from '../context/ToastContext'

/** Confirm → animated sign-out → home → toast. Shared by every "Sign out" control. */
export function useSignOut() {
  const { user, signOut } = useAuth()
  const confirm = useConfirm()
  const toast = useToast()
  const navigate = useNavigate()

  return async () => {
    const ok = await confirm({
      tone: 'logout',
      title: `Sign out${user ? `, ${user.name.split(' ')[0]}` : ''}?`,
      message: user?.role === 'admin'
        ? 'You’ll leave the admin console. All catalogue changes are already saved in this browser.'
        : 'Your enrolments, progress, notes and certificates stay saved in this browser for next time.',
      confirmLabel: 'Yes, sign out',
      cancelLabel: 'Stay signed in',
    })
    if (!ok) return
    await signOut()
    navigate('/')
    toast.success('You have been signed out safely. See you soon!', { title: 'Signed out' })
  }
}
