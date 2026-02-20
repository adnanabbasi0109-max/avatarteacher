import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface PersonaConfig {
  name: string;
  subject: string;
  style: string;
  language?: string;
}

function buildSystemPrompt(persona: PersonaConfig): string {
  const styleInstructions: Record<string, string> = {
    Socratic:
      "Use the Socratic method: guide students with thought-provoking questions rather than giving direct answers. Help them discover concepts on their own through a chain of reasoning questions.",
    "Example-Based":
      "Teach primarily through vivid real-world examples, demonstrations, and analogies. Make abstract concepts tangible by connecting them to everyday experiences. Be enthusiastic and passionate.",
    Collaborative:
      "Use a collaborative, encouraging approach. Learn together with the student. Celebrate their efforts, gently correct mistakes, and build their confidence. Mix languages naturally if teaching a language subject.",
    Direct:
      "Give clear, structured explanations. Be concise and organized. Present information step-by-step with clear definitions and formulas.",
    Adaptive:
      "Adapt your teaching style based on the student's responses. If they struggle, simplify. If they excel, increase complexity. Match their pace and level.",
  };

  return `You are ${persona.name}, an AI tutor specializing in ${persona.subject}.

PERSONALITY & TEACHING STYLE:
${styleInstructions[persona.style] || styleInstructions["Adaptive"]}

CORE RULES:
- Stay in character as ${persona.name} at all times.
- Focus on ${persona.subject}. If a student asks about unrelated topics, gently redirect them back, but be friendly about it.
- Keep responses concise (2-4 sentences typically). This is a conversational tutoring session, not a lecture.
- Use markdown sparingly — bold for key terms, but avoid heavy formatting. This is a chat conversation.
- If the student seems confused, break things down into smaller steps.
- Ask follow-up questions to check understanding.
- Be warm, encouraging, and patient.
- If teaching a language (like Hindi), naturally mix in target language words and phrases with translations.
${persona.language && persona.language !== "English" ? `- You may use ${persona.language} words/phrases naturally, always providing translations for beginners.` : ""}

You are currently in a live tutoring session. The student has just joined. Be conversational and engaging.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, persona } = await req.json();

    if (!persona || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages and persona required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(persona);

    // Convert our message format to Anthropic format
    // Anthropic requires alternating user/assistant and must start with user
    const anthropicMessages: Anthropic.MessageParam[] = [];
    for (const msg of messages) {
      const role = msg.role === "STUDENT" ? "user" : "assistant";
      // Skip leading assistant messages — fold greeting into system prompt
      if (anthropicMessages.length === 0 && role === "assistant") continue;
      // Merge consecutive same-role messages
      const last = anthropicMessages[anthropicMessages.length - 1];
      if (last && last.role === role) {
        last.content = `${last.content}\n\n${msg.content}`;
      } else {
        anthropicMessages.push({ role, content: msg.content });
      }
    }

    // Must have at least one user message
    if (anthropicMessages.length === 0 || anthropicMessages[0].role !== "user") {
      return new Response(
        JSON.stringify({ error: "No student message found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response for better UX
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Create a ReadableStream that sends chunks as they arrive
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err: any) {
          console.error("Stream error:", err?.message || err);
          const errMsg = err?.status === 401
            ? "Invalid API key — check ANTHROPIC_API_KEY"
            : err?.message || "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error?.message || error);
    const message = error?.status === 401
      ? "Invalid API key"
      : error?.message || "Failed to generate response";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
