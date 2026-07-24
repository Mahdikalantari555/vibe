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

const TOOLS: Tool[] = [
  {
    name: "search",
    description: "Search the web for current information.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Search query" } },
      required: ["query"],
    },
    async execute(input: { query: string }) {
      return { tool: "search", result: `[search result for: ${input.query}]` };
    },
  },
  {
    name: "weather",
    description: "Get current weather for a city.",
    inputSchema: {
      type: "object",
      properties: { city: { type: "string", description: "City name" } },
      required: ["city"],
    },
    async execute(input: { city: string }) {
      return { tool: "weather", result: `Weather for ${input.city}: Add a weather API here.` };
    },
  },
  {
    name: "calculator",
    description: "Evaluate a math expression.",
    inputSchema: {
      type: "object",
      properties: { expression: { type: "string", description: "Math expression, e.g. 2 * (3 + 4)" } },
      required: ["expression"],
    },
    async execute(input: { expression: string }) {
      try {
        const result = Function('"use strict"; return (' + input.expression + ')')();
        return { tool: "calculator", result: String(result) };
      } catch (e) {
        return { tool: "calculator", error: (e as Error).message };
      }
    },
  },
  {
    name: "github",
    description: "Fetch information from GitHub: user, repo, or commits.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["user", "repo", "commits"] },
        owner: { type: "string", description: "GitHub owner/login" },
        repo: { type: "string", description: "Repository name" },
      },
      required: ["action", "owner"],
    },
    async execute(input: any) {
      let url = "";
      if (input.action === "user") {
        url = `https://api.github.com/users/${input.owner}`;
      } else if (input.action === "repo") {
        if (!input.repo) return { tool: "github", error: "repo is required" };
        url = `https://api.github.com/repos/${input.owner}/${input.repo}`;
      } else if (input.action === "commits") {
        if (!input.repo) return { tool: "github", error: "repo is required" };
        url = `https://api.github.com/repos/${input.owner}/${input.repo}/commits`;
      } else {
        return { tool: "github", error: "Unknown action" };
      }

      const r = await fetch(url);
      if (!r.ok) return { tool: "github", error: `HTTP ${r.status}` };
      const data = await r.json();
      return { tool: "github", result: data };
    },
  },
];

const TOOL_MAP = new Map(
  TOOLS.map((t) => [t.name, t] as const)
);

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
  const tool = TOOL_MAP.get(toolName);
  if (!tool) return { error: `Unknown tool: ${toolName}` };
  return tool.execute(args);
}

export function buildSystemPrompt(memories: string[], systemPrompt?: string): string {
  const base = systemPrompt || "You are Hermes, a helpful assistant on Telegram.";
  if (!memories.length) return base;
  return `${base}\n\nKnown facts about the user:\n${memories.map((m, i) => `${i + 1}. ${m}`).join("\n")}`;
}

export { TOOLS };
