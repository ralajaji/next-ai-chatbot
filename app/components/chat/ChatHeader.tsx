"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { Session } from "next-auth";

interface ChatHeaderProps {
  session: Session | null;
  onToggleSidebar?: () => void;
}

export default function ChatHeader({ session, onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-200">RayyanGPT</h1>
      </div>
      <div className="flex items-center gap-2">
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="rounded-full w-8 h-8 object-cover"
            crossOrigin="anonymous"
            // onError={(e) => {
            //   console.error("Image failed to load:", session.user.image);
            //   (e.target as HTMLImageElement).style.display = "none";
            // }}
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
