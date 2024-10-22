'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AuthPage from "@/app/auth/page"
import { useAuth } from '@/contexts/auth-context'

interface LoginModalProps {
  children: React.ReactNode
}

export const LoginModal: React.FC<LoginModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  React.useEffect(() => {
    if (user) {
      setIsOpen(false)
    }
  }, [user])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <AuthPage />
      </DialogContent>
    </Dialog>
  )
}
