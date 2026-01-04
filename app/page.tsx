'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Wait for session to load
    
    if (session) {
      router.push('/chat')
    } else {
      router.push('/login')
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
