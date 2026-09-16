import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
});

http.route({
  path: "/mithra/chat",
  method: "OPTIONS",
  handler: httpAction(async (_, req) => new Response(null, { headers: cors(req.headers.get("Origin")) })),
});
http.route({
  path: "/mithra/chat",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const result = await ctx.runAction(api.ai.chat, { message: String(body.message || ""), history: body.history || [] });
      return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json", ...cors(req.headers.get("Origin")) } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "AI error" }), { status: 500, headers: { "Content-Type": "application/json", ...cors(req.headers.get("Origin")) } });
    }
  }),
});

http.route({
  path: "/mithra/speak",
  method: "OPTIONS",
  handler: httpAction(async (_, req) => new Response(null, { headers: cors(req.headers.get("Origin")) })),
});
http.route({
  path: "/mithra/speak",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const result = await ctx.runAction(api.ai.speak, { text: String(body.text || "") });
      return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json", ...cors(req.headers.get("Origin")) } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Speech error" }), { status: 500, headers: { "Content-Type": "application/json", ...cors(req.headers.get("Origin")) } });
    }
  }),
});

export default http;
