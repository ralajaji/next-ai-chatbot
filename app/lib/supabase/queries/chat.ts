import { supabase } from "../supabase";

export async function createChat(userId: string, title?: string) {
  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId, title: title || "New Chat" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveMessage(
  chatId: string,
  role: "user" | "assistant" | "system",
  content: string
) {
  const { error } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, role, content });

  if (error) throw error;
}

export async function getChatMessages(chatId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUserChats(userId: string) {
  console.log("Fetching chats for user:", userId);
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateChatTimestamp(chatId: string) {
  const { error } = await supabase
    .from("chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  if (error) throw error;
}