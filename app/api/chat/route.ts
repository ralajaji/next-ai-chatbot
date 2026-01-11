import { UIMessage, streamText, convertToModelMessages, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  saveMessage,
  updateChatTimestamp,
} from "@/app/lib/supabase/queries/chat";

export async function POST(req: Request) {
  try {
    const {
      messages,
      webSearch,
      chatId,
      userId,
    }: {
      messages: (UIMessage & { parts: { text: string } })[];
      webSearch?: boolean;
      chatId?: string;
      userId?: string;
    } = await req.json();

    // Save user message to database
    if (chatId && userId) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "user") {
        // Get text from parts array - find the text part
        const textPart = lastMessage.parts?.find((p: { type: string }) => p.type === "text") as { type: string; text: string } | undefined;
        const content = textPart?.text || "";
        if (content) {
          await saveMessage(chatId, "user", content);
        }
      }
    }

    const tools = webSearch
      ? { web_search_preview: openai.tools.webSearchPreview({}) }
      : undefined;

    const systemPrompt = webSearch
      ? "You are RayyanGPT. Always provide concise, short answers. Keep responses brief and to the point. You have access to web search which can find current information and images. When users ask for images, search the web and include direct image URLs (ending in .jpg, .png, .webp, etc.) in your response using markdown format like ![description](image-url). The images will be rendered inline automatically."
      : "You are RayyanGPT. Always provide concise, short answers. Keep responses brief and to the point.";

    const result = streamText({
      model: webSearch ? openai.responses("gpt-5-mini") : openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools,
      ...(webSearch && { stopWhen: stepCountIs(2) }),
      onFinish: async ({ text }) => {
        // Save assistant response to database
        if (chatId && userId) {
          await saveMessage(chatId, "assistant", text);
          await updateChatTimestamp(chatId);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
