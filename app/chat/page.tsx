'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function ChatPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  // Dummy chat messages
  const messages = [
    {
      role: 'user',
      content: 'What is the latest news on space exploration? Specifically about Mars missions.'
    },
    {
      role: 'assistant',
      content: `Here are the latest updates regarding Mars exploration:

• **Perseverance Rover:** NASA's rover has recently collected new rock samples from the Jezero Crater delta, which may hold clues to ancient microbial life.
• **Starship Development:** SpaceX is preparing for the next orbital test flight of Starship, the vehicle intended for future crewed missions to Mars.
• **Sample Return Mission:** ESA and NASA are refining plans for the Mars Sample Return mission, aiming to bring samples back to Earth in the early 2030s.`
    },
    {
      role: 'user',
      content: 'Can you find an image of the Jezero Crater?'
    },
    {
      role: 'assistant',
      content: 'I found a view of the Jezero Crater on Mars.'
    }
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-gray-100">
      {/* Sidebar - Commented out for future use */}
      {/* <aside className="hidden md:flex w-64 flex-col bg-slate-900 h-full">
        <div className="flex flex-col h-full px-3 py-3 gap-2">
          <button className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors group mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white text-black rounded-full p-1 h-7 w-7 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">New Chat</span>
            </div>
            <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <div className="flex flex-col gap-0.5 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Today</div>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-left transition-colors">
              <span className="text-gray-300 text-sm truncate">Space exploration news</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-left transition-colors">
              <span className="text-gray-300 text-sm truncate">React component help</span>
            </button>
            
            <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500">Previous 7 Days</div>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-left transition-colors">
              <span className="text-gray-300 text-sm truncate">Marketing copy ideas</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg hover:bg-slate-800 transition-colors">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session?.user?.name?.[0] || 'U'}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-sm font-medium truncate w-full">
                  {session?.user?.name || 'User'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </aside> */}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-slate-950 h-full w-full">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-gray-200">RayyanGPT</span>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="New Chat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session?.user?.name?.[0] || 'U'}
                </span>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col w-full max-w-3xl mx-auto px-4 pb-32 pt-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="w-full text-gray-100 border-b border-slate-800 group">
                {msg.role === 'user' ? (
                  <div className="flex gap-4 p-4 m-auto text-base">
                    <div className="w-full flex justify-end">
                      <div className="bg-slate-800 text-white rounded-3xl rounded-tr-sm px-5 py-2.5 max-w-[85%]">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 p-4 m-auto text-base">
                    <div className="relative flex flex-col items-center gap-1 shrink-0">
                      <div className="h-8 w-8 bg-emerald-500 rounded-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                      <div className="prose prose-invert max-w-none leading-7">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-slate-950 pt-2 pb-6 px-4">
          <div className="max-w-3xl mx-auto w-full flex flex-col">
            <div className="relative flex flex-col w-full bg-slate-800 border border-slate-600 rounded-3xl shadow-sm focus-within:border-slate-500 transition-colors overflow-hidden">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 resize-none max-h-[200px] py-4 px-12 leading-relaxed"
                placeholder="Message RayyanGPT..."
                rows={1}
                style={{ minHeight: '52px' }}
              />
              <button className="absolute left-3 top-3.5 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button className="absolute right-3 bottom-3 p-1.5 bg-slate-700 text-gray-400 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              RayyanGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
