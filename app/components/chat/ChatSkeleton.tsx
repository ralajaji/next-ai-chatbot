"use client";

import { Star } from "lucide-react";

export default function ChatSkeleton() {
  return (
    <div className="divide-y divide-slate-800/50 animate-pulse">
      {/* User message skeleton */}
      <div className="py-4 flex justify-end">
        <div className="bg-slate-700/50 rounded-2xl rounded-tr-sm px-4 py-3 w-[60%]">
          <div className="h-4 bg-slate-600 rounded w-full mb-2" />
          <div className="h-4 bg-slate-600 rounded w-3/4" />
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="py-4 flex gap-3">
        <div className="h-8 w-8 bg-emerald-500/50 rounded-lg flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-white/50" />
        </div>
        <div className="flex-1 mt-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-[90%]" />
          <div className="h-4 bg-slate-700 rounded w-[85%]" />
          <div className="h-4 bg-slate-700 rounded w-[70%]" />
        </div>
      </div>

      {/* User message skeleton */}
      <div className="py-4 flex justify-end">
        <div className="bg-slate-700/50 rounded-2xl rounded-tr-sm px-4 py-3 w-[45%]">
          <div className="h-4 bg-slate-600 rounded w-full" />
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="py-4 flex gap-3">
        <div className="h-8 w-8 bg-emerald-500/50 rounded-lg flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-white/50" />
        </div>
        <div className="flex-1 mt-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-[95%]" />
          <div className="h-4 bg-slate-700 rounded w-[80%]" />
        </div>
      </div>
    </div>
  );
}
