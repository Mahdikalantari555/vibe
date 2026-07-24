import { Env } from "./telegram";
import { chatWithLlm } from "./openrouter";
import { addConversation, getConversations, getMemories, getOrCreateUser } from "./memory/d1";
import { extractFacts } from "./planner";
import { plan, executeTool, buildSystemPrompt, TOOLS } from "./executor";

export interface AgentRequest {
  env: Env;
  chatId: number;
  userId: number;
  text: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export async function handleAgentRequest(req: AgentRequest): Promise<string> {
  const { env, chatId, userId, text } = req;

  await getOrCreateUser(env, String(userId), req.username, req.firstName, req.lastName);

  const history = await getConversations(env, String(userId), 20);
  const memories = await getMemories(env, String(userId));

  await extractFacts(env, String(userId), text);

  const systemPrompt = buildSystemPrompt(memories.map((m) => m.value), env.SYSTEM_PROMPT);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.reverse().map((c) => ({ role: c.role as "user" | "assistant" | "system", content: c.content })),
    { role: "user" as const, content: text },
  ];

  const maxLoops = 3;
  let currentMessages = messages;
  let finalResponse = "";

  for (let i = 0; i < maxLoops; i++) {
    const result = await plan(env, currentMessages, TOOLS);

    if (result.toolCalls && result.toolCalls.length > 0) {
      for (const tc of result.toolCalls) {
        const toolResult = await executeTool(env, tc.name, tc.arguments);
        currentMessages.push({ role: "assistant", content: result.response || `Tool ${tc.name} executed.` });
        currentMessages.push({ role: "user", content: `Tool result for ${tc.name}: ${JSON.stringify(toolResult)}` });
      }
    } else {
      finalResponse = result.response;
      break;
    }
  }

  if (!finalResponse) {
    finalResponse = "I processed your request but couldn't complete it.";
  }

  const now = Date.now();
  await addConversation(env, {
    conversation_id: `conv_${userId}_${now}`,
    user_id: String(userId),
    role: "user",
    content: text,
    created_at: now,
  });
  await addConversation(env, {
    conversation_id: `conv_${userId}_${now}`,
    user_id: String(userId),
    role: "assistant",
    content: finalResponse,
    created_at: now + 1,
  });

  return finalResponse;
}
