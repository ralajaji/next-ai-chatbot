"use client";

import { useSession } from "next-auth/react";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Send, Globe, Loader2, Star } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatSkeleton from "../components/chat/ChatSkeleton";
import EmptyState from "../components/chat/EmptyState";
import { renderTextWithMedia } from "../lib/utils/markdown";
import { createChatClient, getChatMessagesClient } from "../lib/supabase/queries/chat.client";

interface ChatPageProps {
  searchParams: Promise<{ chatId?: string }>;
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { chatId } = use(searchParams);
  
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [input, setInput] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(!!chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({});

  // Load existing chat messages when chatId is present
  useEffect(() => {
    if(!chatId) {
      setIsLoadingChat(false);
      return;
    }
    const loadChatMessages = async () => {
      setIsLoadingChat(true);
      try {
        const dbMessages = await getChatMessagesClient(chatId);
        if (!dbMessages || dbMessages.length === 0) {
          // Chat doesn't exist or is empty, remove chatId from URL
          router.replace("/chat", { scroll: false });
          return;
        }
        
        // Convert DB messages to useChat format
        const formattedMessages = dbMessages.map((msg: { id: string; role: string; content: string; created_at: string }) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          parts: [{ type: "text" as const, text: msg.content }],
          createdAt: new Date(msg.created_at),
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading chat:", error);
        router.replace("/chat", { scroll: false });
      } finally {
        setIsLoadingChat(false);
      }
    };

    loadChatMessages();
  }, [chatId]);

  const toggleWebSearch = () => {
    setIsWebSearchEnabled(!isWebSearchEnabled);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    router.push("/chat");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !session?.user?.email) return;

    let activeChatId = chatId;

    // Create chat if it doesn't exist
    if (!activeChatId) {
      try {
        const chatTitle = input.slice(0, 50);
        const newChat = await createChatClient(session.user.email, chatTitle);
        activeChatId = newChat.id;
        router.replace(`/chat?chatId=${activeChatId}`, { scroll: false });
      } catch (error) {
        console.error("Error creating chat:", error);
        return;
      }
    }

    sendMessage(
      { text: input },
      {
        body: {
          webSearch: isWebSearchEnabled,
          chatId: activeChatId,
          userId: session.user.email,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-slate-950 text-gray-100">
      <ChatSidebar
        userId={session?.user?.id}
        onNewChat={handleNewChat}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col h-full max-h-screen w-full overflow-hidden">
        <ChatHeader
          session={session}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-none">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-40 sm:pb-32">
            {isLoadingChat ? (
              <ChatSkeleton />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`py-4 ${
                      msg.role === "user" ? "flex justify-end" : "flex gap-3"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <div className="bg-slate-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[80%] break-words overflow-wrap-anywhere">
                        {msg.parts?.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div
                                  key={index}
                                  className="whitespace-pre-wrap break-words"
                                >
                                  {renderTextWithMedia(part.text || "")}
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    ) : (
                      <>
                        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-gray-100 mt-1 flex-1 min-w-0 break-words">
                          {/* Show searching indicator if web search is active but no text yet */}
                          {msg.parts?.some(
                            (part) => part.type === "tool-web_search_preview"
                          ) &&
                            !msg.parts?.some(
                              (part) =>
                                part.type === "text" &&
                                part.text &&
                                part.text.trim().length > 0
                            ) && (
                              <div className="mb-2 text-gray-500 text-sm">
                                Searching the web...
                              </div>
                            )}
                          {/* Show searched indicator if web search completed and has text */}
                          {msg.parts?.some(
                            (part) => part.type === "tool-web_search_preview"
                          ) &&
                            msg.parts?.some(
                              (part) =>
                                part.type === "text" &&
                                part.text &&
                                part.text.trim().length > 0
                            ) && (
                              <div className="mb-2 text-gray-500 text-sm">
                                Searched the web
                              </div>
                            )}
                          {msg.parts?.map((part, index) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <div
                                    key={index}
                                    className="whitespace-pre-wrap break-words overflow-wrap-anywhere"
                                  >
                                    {renderTextWithMedia(part.text || "")}
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {status === "submitted" && (
                  <div className="flex gap-3 py-4">
                    <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {[0, 150, 300].map((d) => (
                        <div
                          key={d}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mt-2"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-800 border border-slate-700 rounded-2xl focus-within:border-slate-600 transition-colors"
            >
              <div className="flex items-end gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== "ready"}
                  placeholder={
                    isWebSearchEnabled ? "Search the web..." : "Ask anything..."
                  }
                  className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none py-3 pl-4 pr-2 focus:outline-none disabled:opacity-50 max-h-[200px]"
                />
                <button
                  type="submit"
                  disabled={status !== "ready"}
                  className="m-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status !== "ready" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="px-3 pb-2">
                <button
                  type="button"
                  onClick={toggleWebSearch}
                  title="Search the web"
                  className={`p-2 rounded-full transition-all ${
                    isWebSearchEnabled
                      ? "text-blue-400 bg-blue-500/20"
                      : "text-gray-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-3 mt-3">
              <p className="text-xs text-gray-500">
                RayyanGPT may produce inaccurate information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
