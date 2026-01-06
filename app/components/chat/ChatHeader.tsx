"use client";

import { signOut } from "next-auth/react";
import { Plus, LogOut } from "lucide-react";
import { Session } from "next-auth";

interface ChatHeaderProps {
  session: Session | null;
  onNewChat: () => void;
}

export default function ChatHeader({ session, onNewChat }: ChatHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-200">RayyanGPT</h1>
        <button
          onClick={onNewChat}
          className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          aria-label="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt="User"
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || "U"}
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
