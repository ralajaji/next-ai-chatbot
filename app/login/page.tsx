'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/chat'

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white overflow-hidden transition-colors duration-300">
      {/* Background Gradient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-[400px] z-10">
        {/* Logo and Title */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="size-14 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Welcome back</h1>
          <p className="text-slate-400 text-center mt-2 text-base font-normal">
            Sign in to continue to AI Chat
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium h-12 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
              <path d="M12 4.36c1.6 0 3.06.56 4.23 1.64l3.18-3.18C17.46 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-slate-400">
          <a className="hover:text-slate-300 transition-colors text-xs font-medium" href="#">
            Terms
          </a>
          <a className="hover:text-slate-300 transition-colors text-xs font-medium" href="#">
            Privacy
          </a>
          <a className="hover:text-slate-300 transition-colors text-xs font-medium" href="#">
            Help
          </a>
        </div>
      </div>
    </div>
  )
}
