import { supabase } from "../supabase";

export async function createChatClient(userId: string, title?: string) {
  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId, title: title || "New Chat" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChatMessagesClient(chatId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
