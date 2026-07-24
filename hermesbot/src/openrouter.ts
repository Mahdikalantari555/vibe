export interface Env {
  LLM_API_KEY: string;
  LLM_BASE_URL: string;
  MODEL: string;
}

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmChoice {
  message: { content: string };
}

export interface LlmResponse {
  choices: LlmChoice[];
  error?: { message: string };
}

export async function chatWithLlm(
  env: Env,
  messages: LlmMessage[],
  tools?: any[]
): Promise<string> {
  const body: any = {
    model: env.MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const r = await fetch(`${env.LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.LLM_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`LLM ${r.status}: ${text}`);
  }

  const data = (await r.json()) as LlmResponse;

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.choices[0]?.message?.content ?? "(empty response)";
}

export async function chatWithLlmStream(
  env: Env,
  messages: LlmMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const r = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OpenRouter ${r.status}: ${text}`);
  }

  if (!r.body) {
    throw new Error("No response body");
  }

  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {
        // skip invalid JSON
      }
    }
  }
}
