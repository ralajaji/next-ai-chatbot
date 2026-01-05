import {
  UIMessage,
  streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages, webSearch }: { messages: UIMessage[]; webSearch?: boolean } =
      await req.json();

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
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
