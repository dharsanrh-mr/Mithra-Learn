import { action } from "./_generated/server";
import { v } from "convex/values";

const tutorPrompt = `You are Mithra, a friendly Spoken English tutor for Tamil-speaking learners.
Rules:
- Keep replies short: 1-3 sentences.
- Encourage the learner.
- Correct grammar naturally: show the corrected English sentence.
- When useful, add a very short Tamil explanation.
- Ask one simple follow-up question so speaking practice continues.
- Focus on everyday spoken English, not formal textbook English.`;

export const chat = action({
  args: {
    message: v.string(),
    history: v.optional(v.array(v.object({ role: v.string(), content: v.string() }))),
  },
  handler: async (_ctx, args) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not configured in Convex.");

    const history = (args.history ?? []).slice(-12);
    const input = [
      { role: "developer", content: tutorPrompt },
      ...history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      { role: "user", content: args.message },
    ];

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "gpt-5.6-luna", input, max_output_tokens: 180 }),
    });
    if (!res.ok) throw new Error(`OpenAI chat error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return { text: data.output_text ?? "Sorry, I could not reply right now." };
  },
});

export const speak = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not configured in Convex.");
    const text = args.text.slice(0, 4096);
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: "coral", input: text, response_format: "mp3", instructions: "Warm, friendly Indian English tutor. Clear and slightly slow." }),
    });
    if (!res.ok) throw new Error(`OpenAI speech error ${res.status}: ${await res.text()}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    return { audioBase64: btoa(binary), mime: "audio/mpeg" };
  },
});
