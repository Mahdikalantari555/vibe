import { Env } from "./telegram";
import { handleAgentRequest } from "./agent";
import { AgentDO } from "./memory/durable";

export { AgentDO };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/setup") {
      const hook = url.searchParams.get("url");
      if (!hook) return new Response("?url= missing", { status: 400 });
      const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: hook }),
      });
      return new Response(await r.text());
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok", timestamp: Date.now() });
    }

    if (request.method !== "POST") {
      return new Response("Hermesbot is running.", { status: 200 });
    }

    let update: any;
    try {
      update = await request.json();
    } catch {
      return new Response("invalid json", { status: 400 });
    }

    try {
      const msg = update?.message;
      if (!msg || !msg.text) return new Response("ok");

      const chatId = msg.chat?.id;
      const userId = msg.from?.id ?? chatId;
      const text = msg.text;

      if (!chatId) return new Response("ok");

      const response = await handleAgentRequest({
        env,
        chatId: Number(chatId),
        userId: Number(userId),
        text,
        username: msg.from?.username,
        firstName: msg.from?.first_name,
        lastName: msg.from?.last_name,
      });

      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: response,
          reply_to_message_id: msg.message_id,
        }),
      });
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: update?.message?.chat?.id,
          text: `⚠️ Error: ${err}`,
        }),
      });
    }

    return new Response("ok");
  },

  async scheduled(event: any, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      try {
        if (!env.KV) return;
        const subsRaw = await env.KV.get("agent:subscribers");
        const subscribers: number[] = subsRaw ? JSON.parse(subsRaw) : [];
        const greeting = "🌿 سلام! هرمس اینجاست. امروز چطور می‌تونم کمکت کنم؟";
        for (const id of subscribers) {
          try {
            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ chat_id: id, text: greeting }),
            });
          } catch (e) {
            console.error("scheduled send failed", id, e);
          }
        }
      } catch (e) {
        console.error("scheduled error", e);
      }
    })());
  },
};
