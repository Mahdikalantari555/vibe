interface Env {
  BOT_TOKEN: string;
  KILO_API_KEY: string;
  CHANNEL_ID: string;
  KV: any;
}

const KILO_BASE_URL = "https://api.kilo.ai/api/gateway";
const KILO_MODEL = "kilocode/kilo/auto";
const SUBS_KEY = "subscribers";

const SYSTEM_PROMPT = `تو یک نویسنده الهام‌بخش هستی که آموزه‌های کوتاه و آرام‌بخش بر پایه اندیشه‌های زرتشتی (با تمرکز بر «پندار نیک، گفتار نیک، کردار نیک») به زبان فارسی می‌نویسی.

سبک نوشته:
- با یک سطر کوتاه و زیبا آغاز کن که گاهی با نمادی مثل ✨ یا 🌙 یا «وُهومن:» شروع شود.
- یک یا دو پاراگراف کوتاه (مجموعاً حدود ۱۵۰ تا ۳۰۰ کلمه) با لحن شاعرانه، آرام و برانگیزاننده.
- در صورت مناسب، در میانه یا پایان یک پرسش کوتاه تأملی برای خواننده بیاور.
- همیشه متن را دقیقاً با این سطر تمام کن:
پندار نیک، گفتار نیک، کردار نیک
- از تکرار الگوی یکسان در هر بار پرهیز کن؛ هر بار موضوع یا زاویهٔ تازه‌ای برگزین.
- فقط متن آموزه را برگردان، بدون هیچ توضیح یا نقل‌قول اضافه.`;

const NEW_TEACHING_MARKUP = {
  inline_keyboard: [[{ text: "✨ آموزهٔ جدید", callback_data: "new_teaching" }]],
};

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

function buildUserPrompt(seed: string): string {
  const today = new Date().toLocaleDateString("fa-IR");
  return `امروز ${today} است. یک آموزهٔ تازه و متفاوت بنویس. نکتهٔ تصادفی برای تنوع: ${seed}`;
}

async function generateTeaching(apiKey: string, seed: string): Promise<string> {
  const res = await fetch(`${KILO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: KILO_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(seed) },
      ],
      max_tokens: 700,
      temperature: 0.9,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Kilo Gateway ${res.status}: ${t}`);
  }

  const data: any = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return content.trim() || "امشب آرامش را برگزین.";
}

async function tg(token: string, method: string, body: any): Promise<any> {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Telegram ${method} ${r.status}: ${t}`);
  }
  return r.json();
}

function chunk(text: string, max = 4000): string[] {
  if (text.length <= max) return [text];
  const out: string[] = [];
  for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max));
  return out;
}

async function sendLong(token: string, chatId: string | number, text: string): Promise<void> {
  for (const c of chunk(text)) {
    await tg(token, "sendMessage", { chat_id: chatId, text: c });
  }
}

async function addSubscriber(kv: any, chatId: number): Promise<void> {
  const raw = await kv.get(SUBS_KEY);
  const list: number[] = raw ? JSON.parse(raw) : [];
  if (!list.includes(chatId)) {
    list.push(chatId);
    await kv.put(SUBS_KEY, JSON.stringify(list));
  }
}

async function getSubscribers(kv: any): Promise<number[]> {
  const raw = await kv.get(SUBS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function runNightlyBroadcast(env: Env): Promise<void> {
  const teaching = await generateTeaching(env.KILO_API_KEY, randomSeed() + "-nightly");

  if (env.CHANNEL_ID) {
    try {
      await sendLong(env.BOT_TOKEN, env.CHANNEL_ID, teaching);
    } catch (e) {
      console.error("channel send failed", e);
    }
  }

  const subs = await getSubscribers(env.KV);
  for (const id of subs) {
    try {
      await sendLong(env.BOT_TOKEN, id, teaching);
    } catch (e) {
      console.error("subscriber send failed", id, e);
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let update: any;
    try {
      update = await request.json();
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    const cb = update?.callback_query;
    if (cb) {
      const chatId = cb.message?.chat?.id ?? cb.from?.id;
      await tg(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: cb.id });
      try {
        const teaching = await generateTeaching(env.KILO_API_KEY, randomSeed());
        await sendLong(env.BOT_TOKEN, chatId, teaching);
      } catch {
        await sendLong(env.BOT_TOKEN, chatId, "متاسفم، الان نتونستم آموزه بسازم. دوباره امتحان کن.");
      }
      return new Response("OK");
    }

    const msg = update?.message;
    if (msg && msg.chat?.id) {
      const chatId: number = msg.chat.id;

      if (msg.chat.type === "private") {
        await addSubscriber(env.KV, chatId);
      }

      const text: string = msg.text ?? "";
      const welcome =
        "🌿 سلام\nهر شب ساعت ۱۱:۱۱ یک آموزهٔ زرتشتی برایت می‌فرستم. هر وقت خواستی آموزهٔ تازه‌ای ببین، دکمهٔ زیر را بزن.";
      const prompt = "برای دریافت یک آموزهٔ تازه، دکمهٔ زیر را بزن:";

      await tg(env.BOT_TOKEN, "sendMessage", {
        chat_id: chatId,
        text: text === "/start" || text === "/help" || text === "" ? welcome : prompt,
        reply_markup: NEW_TEACHING_MARKUP,
      });
      return new Response("OK");
    }

    return new Response("OK");
  },

  async scheduled(_event: any, env: Env, _ctx: any): Promise<void> {
    await runNightlyBroadcast(env);
  },
};
