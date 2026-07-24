export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL: string;
  SYSTEM_PROMPT: string;
  MODEL: string;
  KV: KVNamespace;
  D1: D1Database;
  AGENT: DurableObjectNamespace;
}

export interface TelegramMessage {
  message_id: number;
  chat: { id: number; type: string };
  text?: string;
  from?: { id: number };
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  callback_query?: any;
}

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const telegramApi = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export async function sendMessage(env: Env, chatId: number, text: string): Promise<void> {
  await fetch(telegramApi(env.TELEGRAM_BOT_TOKEN, "sendMessage"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function sendTyping(env: Env, chatId: number): Promise<void> {
  await fetch(telegramApi(env.TELEGRAM_BOT_TOKEN, "sendChatAction"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  });
}

export function getUserKey(chatId: number, suffix: string): string {
  return `user:${chatId}:${suffix}`;
}

export async function getUserProfile(env: Env, chatId: number): Promise<any> {
  const raw = await env.KV.get(getUserKey(chatId, "profile"));
  return raw ? JSON.parse(raw) : null;
}

export async function setUserProfile(env: Env, chatId: number, profile: any): Promise<void> {
  await env.KV.put(getUserKey(chatId, "profile"), JSON.stringify(profile));
}

export async function getGlobalConfig(env: Env): Promise<any> {
  const raw = await env.KV.get("agent:global:config");
  return raw ? JSON.parse(raw) : null;
}

export async function setGlobalConfig(env: Env, config: any): Promise<void> {
  await env.KV.put("agent:global:config", JSON.stringify(config));
}
