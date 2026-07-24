import { Env } from "./telegram";
import { LlmMessage } from "./openrouter";

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  execute(input: any): Promise<any>;
}

export async function plan(
  env: Env,
  messages: LlmMessage[],
  tools: Tool[]
): Promise<{ response: string; toolCalls?: Array<{ name: string; arguments: Record<string, any> }> }> {
  const body: any = {
    model: env.MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  };

  if (tools.length > 0) {
    body.tools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema,
      },
    }));
    body.tool_choice = "auto";
  }

  const r = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OpenRouter ${r.status}: ${text}`);
  }

  const data: any = await r.json();
  const choice = data.choices?.[0]?.message;

  if (choice?.tool_calls && choice.tool_calls.length > 0) {
    return {
      response: choice.content || "",
      toolCalls: choice.tool_calls.map((tc: any) => ({
        name: tc.function?.name || tc.name,
        arguments: typeof tc.function?.arguments === "string"
          ? JSON.parse(tc.function.arguments)
          : tc.arguments,
      })),
    };
  }

  return { response: choice?.content || "(empty)" };
}

export async function executeTool(env: Env, toolName: string, args: any): Promise<any> {
  const toolMap: Record<string, (args: any) => Promise<any>> = {
    search: async (a: any) => (await import("../tools/search")).searchTool.execute(a),
    weather: async (a: any) => (await import("../tools/weather")).weatherTool.execute(a),
    calculator: async (a: any) => (await import("../tools/calculator")).calculatorTool.execute(a),
    github: async (a: any) => (await import("../tools/github")).githubTool.execute(a),
  };

  const fn = toolMap[toolName];
  if (!fn) return { error: `Unknown tool: ${toolName}` };
  return fn(args);
}

export function buildSystemPrompt(memories: string[], systemPrompt?: string): string {
  const base = systemPrompt || "You are Hermes, a helpful assistant on Telegram.";
  if (!memories.length) return base;
  return `${base}\n\nKnown facts about the user:\n${memories.map((m, i) => `${i + 1}. ${m}`).join("\n")}`;
}
