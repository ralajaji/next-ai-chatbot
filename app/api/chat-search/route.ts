// import {
//   UIMessage,
//   streamText,
//   convertToModelMessages,
//   InferUITools,
//   UIDataTypes,
//   stepCountIs,
// } from "ai";
// import { openai } from "@ai-sdk/openai";

// const tools = {
//   web_search_preview: openai.tools.webSearchPreview({}),
// };

// export type ChatSearchTool = InferUITools<typeof tools>;
// export type ChatSearchMessage = UIMessage<never, UIDataTypes, ChatSearchTool>;

// export async function POST(req: Request) {
//   try {
//     const { messages }: { messages: UIMessage[] } = await req.json();

//     const result = streamText({
//       model: openai.responses("gpt-5-nano"),
//       system:
//         "You are RayyanGPT. Always provide concise, short answers. Keep responses brief and to the point.",
//       messages: await convertToModelMessages(messages),
//       tools,
//       stopWhen: stepCountIs(2),
//     });

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error("Error in /api/chat:", error);
//     return new Response("Error processing request", { status: 500 });
//   }
// }
