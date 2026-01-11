"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { groupByDate } from "@/app/lib/utils/dates";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  userId?: string;
  onNewChat: () => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function ChatSidebar({
  userId,
  onNewChat,
  isMobileOpen,
  onClose,
}: ChatSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("chatId");
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchChats();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    onClose?.();
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat?chatId=${chatId}`);
    onClose?.();
  };

  const { today, previous7Days, previous30Days, older } = groupByDate(chats);

  return (
    <>
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50
        flex flex-col w-65 bg-slate-900 h-full shrink-0 transition-all duration-300 overflow-hidden
        transform md:transform-none
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full px-3 py-3 gap-2">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-start gap-2 px-3 py-2.5 rounded-lg transition-colors mb-2"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">New Chat</span>
          </button>

          <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {loading ? (
              <div className="space-y-2 px-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-slate-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No chats yet
              </div>
            ) : (
              <>
                {today.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                      Today
                    </div>
                    {today.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors truncate group relative ${
                          currentChatId === chat.id
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800 text-gray-300"
                        }`}
                      >
                        <span className="text-sm truncate relative z-10 w-full">
                          {chat.title}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {previous7Days.length > 0 && (
                  <>
                    <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500">
                      Previous 7 Days
                    </div>
                    {previous7Days.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors truncate group relative ${
                          currentChatId === chat.id
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800 text-gray-300"
                        }`}
                      >
                        <span className="text-sm truncate relative z-10 w-full">
                          {chat.title}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {previous30Days.length > 0 && (
                  <>
                    <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500">
                      Previous 30 Days
                    </div>
                    {previous30Days.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors truncate group relative ${
                          currentChatId === chat.id
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800 text-gray-300"
                        }`}
                      >
                        <span className="text-sm truncate relative z-10 w-full">
                          {chat.title}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {older.length > 0 && (
                  <>
                    <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500">
                      Older
                    </div>
                    {older.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors truncate group relative ${
                          currentChatId === chat.id
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800 text-gray-300"
                        }`}
                      >
                        <span className="text-sm truncate relative z-10 w-full">
                          {chat.title}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
