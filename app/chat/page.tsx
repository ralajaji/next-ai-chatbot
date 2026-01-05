"use client";

import { useSession, signOut } from "next-auth/react";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Globe, Plus, LogOut, Loader2, Star } from "lucide-react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat();

  const toggleWebSearch = () => {
    setIsWebSearchEnabled(!isWebSearchEnabled);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(
      { text: input },
      { body: { webSearch: isWebSearchEnabled } }
    );
    setInput("");
  };

  // Render text with inline images (replacing markdown links with images where applicable)
  const renderTextWithMedia = (text: string) => {
    // Split by markdown images ![alt](url) and links [text](url)
    const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]*\]\([^)]+\))/g);
    
    return parts.map((part, idx) => {
      // Check if this is a markdown image ![alt](url)
      const imageMatch = part.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        const [, altText, url] = imageMatch;
        const cleanUrl = url.replace(/\?utm_source=openai$/, '');
        return (
          <span key={idx} className="block my-3">
            <img
              src={cleanUrl}
              alt={altText}
              className="rounded-lg max-w-full max-h-80 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </span>
        );
      }

      // Check if this is a markdown link [text](url)
      const linkMatch = part.match(/\[([^\]]*)\]\(([^)]+)\)/);
      
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        const cleanUrl = url.replace(/\?utm_source=openai$/, '');
        
        // Render as image (hide if it fails to load)
        return (
          <span key={idx} className="block my-3">
            <img
              src={cleanUrl}
              alt={linkText}
              className="rounded-lg max-w-full max-h-80 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </span>
        );
      }
      
      // Regular text
      return <span key={idx}>{part}</span>;
    });
  };

  const renderMessageParts = (parts: Array<any> | undefined) => {
    if (!parts) return null;
    console.log(parts);

    return parts.map((part, index) => {
      switch (part.type) {
        case "text":
          return (
            <div key={index} className="whitespace-pre-wrap">
              {renderTextWithMedia(part.text)}
            </div>
          );

        case "tool-web_search_preview":
          const state = part.state;

          switch (state) {
            case "input-streaming":
              return (
                <div
                  key={index}
                  className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching the web...</span>
                  </div>
                </div>
              );

            case "input-availability":
              return (
                <div
                  key={index}
                  className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <Globe className="w-4 h-4" />
                    <span>Query: {part.query || "Preparing search..."}</span>
                  </div>
                </div>
              );

            case "output-available":
              return (
                <div
                  key={index}
                  className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">Web Search Results</span>
                  </div>
                  {part.results && (
                    <div className="text-gray-300 text-sm space-y-3 mt-2">
                      {part.results.map((result: any, idx: number) => (
                        <div
                          key={idx}
                          className="pl-2 border-l-2 border-emerald-500/30"
                        >
                          {result.image && (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block mb-2"
                            >
                              <img
                                src={result.image}
                                alt={result.title || "Search result image"}
                                className="rounded-lg max-w-full max-h-48 object-cover hover:opacity-90 transition-opacity"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </a>
                          )}
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            {result.title}
                          </a>
                          {result.description && (
                            <p className="text-gray-400 text-xs mt-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );

            case "output-error":
              return (
                <div
                  key={index}
                  className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <Globe className="w-4 h-4" />
                    <span>
                      Search failed: {part.error || "Unable to search the web"}
                    </span>
                  </div>
                </div>
              );

            default:
              return null;
          }

        default:
          return null;
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-gray-100">
      <main className="flex-1 flex flex-col h-full w-full">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-200">RayyanGPT</h1>
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
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
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 pb-32">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500">
                  Start a conversation with RayyanGPT
                </p>
              </div>
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
                        {renderMessageParts(msg.parts)}
                      </div>
                    ) : (
                      <>
                        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-gray-100 mt-1 flex-1">
                          {renderMessageParts(msg.parts)}
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
                      {/* <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> */}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <br />

        {status === "submitted" && <Loader2 />}

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
