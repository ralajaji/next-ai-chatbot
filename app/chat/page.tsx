'use client'

import { useSession, signOut } from 'next-auth/react'

export default function ChatPage() {
  const { data: session } = useSession()
  console.log('User session:', session)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
          <div className="flex items-center gap-4">
            {session?.user && (
              <>
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Welcome to the Chat! 👋
          </h2>
          <p className="text-gray-600">
            This is your protected chat page. Only authenticated users can access this page.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Logged in as: <span className="font-semibold">{session?.user?.email}</span>
          </p>
          
          {/* You can add your chat UI components here */}
          <div className="mt-8 rounded-lg border border-gray-200 p-6">
            <p className="text-center text-gray-500">
              Add your chat interface here
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
