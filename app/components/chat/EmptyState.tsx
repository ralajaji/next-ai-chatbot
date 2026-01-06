import { Star } from "lucide-react";

export default function EmptyState() {
  return (
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
  );
}
