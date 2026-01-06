"use client";

import { useSession } from "next-auth/react";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Globe, Loader2, Star } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import EmptyState from "../components/chat/EmptyState";
import { renderTextWithMedia } from "../lib/utils/markdown";

export default function ChatPage() {
  const { data: session } = useSession();
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat();

  const toggleWebSearch = () => {
    setIsWebSearchEnabled(!isWebSearchEnabled);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input }, { body: { webSearch: isWebSearchEnabled } });
    setInput("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-gray-100">
      <main className="flex-1 flex flex-col h-full w-full">
        <ChatHeader session={session} onNewChat={handleNewChat} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 pb-32">
            {messages.length === 0 ? (
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
                      <div className="bg-slate-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        {msg.parts?.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div
                                  key={index}
                                  className="whitespace-pre-wrap"
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
                        <div className="text-gray-100 mt-1 flex-1">
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
                                    className="whitespace-pre-wrap"
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-6 pb-6 px-4">
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
