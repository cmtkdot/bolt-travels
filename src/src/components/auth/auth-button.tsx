'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LoginModal } from './LoginModal'

export default function AuthButton() {
  const { user, signOut } = useAuth()

  if (user) {
    return <Button onClick={signOut}>Sign Out</Button>
  }

  return (
    <LoginModal>
      <Button>Log In / Sign Up</Button>
    </LoginModal>
  )
}
