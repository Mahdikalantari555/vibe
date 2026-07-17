export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  LLM_API_KEY: string;
  LLM_BASE_URL: string;
  SYSTEM_PROMPT: string;
  MODEL: string;
}

interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text?: string;
}

interface TelegramUpdate {
  message?: TelegramMessage;
}

interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const telegramApi = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // تنظیم webhook (فقط یکبار): GET /setup?url=https://...
    if (request.method === "GET" && url.pathname === "/setup") {
      const hook = url.searchParams.get("url");
      if (!hook) return new Response("?url= missing", { status: 400 });
      const r = await fetch(telegramApi(env.TELEGRAM_BOT_TOKEN, "setWebhook"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: hook }),
      });
      return new Response(await r.text());
    }

    if (request.method !== "POST") {
      return new Response("Telegram LLM bot is running.", { status: 200 });
    }

    let update: TelegramUpdate;
    try {
      update = await request.json();
    } catch {
      return new Response("invalid json", { status: 400 });
    }

    const msg = update.message;
    if (!msg || !msg.text) return new Response("ok");

    try {
      const reply = await chatWithLlm(env, msg.text);
      await fetch(telegramApi(env.TELEGRAM_BOT_TOKEN, "sendMessage"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: reply,
          reply_to_message_id: msg.message_id,
        }),
      });
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      await fetch(telegramApi(env.TELEGRAM_BOT_TOKEN, "sendMessage"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: `⚠️ Error: ${err}`,
        }),
      });
    }

    return new Response("ok");
  },
};

async function chatWithLlm(env: Env, userText: string): Promise<string> {
  const messages: LlmMessage[] = [
    { role: "system", content: env.SYSTEM_PROMPT },
    { role: "user", content: userText },
  ];

  const r = await fetch(`${env.LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!r.ok) {
    throw new Error(`LLM ${r.status}: ${await r.text()}`);
  }

  const data = await r.json<{ choices: { message: { content: string } }[] }>();
  return data.choices[0]?.message?.content ?? "(empty response)";
}
