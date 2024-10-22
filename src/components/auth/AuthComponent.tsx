'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import AuthPage from '@/app/auth/page'

export function AuthComponent() {
  const { user } = useAuth()

  if (user) {
    return <div>Welcome, {user.email}!</div>
  }

  return <AuthPage />
}

export function useAuthComponent() {
  const { user, signOut } = useAuth()

  return {
    user,
    signOut,
    AuthComponent,
  }
}
