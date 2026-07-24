export interface DurableObjectState {
  messages: Array<{ role: string; content: string; timestamp: number }>;
  memory: string[];
  toolState: Record<string, any>;
  userId: string;
}

export class AgentDO {
  private state: DurableObjectState;

  constructor(private ctx: DurableObjectState, private env: any) {
    this.state = this.ctx.state as DurableObjectState;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "GET" && url.pathname === "/state") {
      return Response.json(this.state);
    }

    if (method === "POST" && url.pathname === "/message") {
      const body = await request.json<{ role: string; content: string }>();
      this.state.messages.push({
        ...body,
        timestamp: Date.now(),
      });
      this.ctx.storage.setSync("state", this.state);
      return Response.json({ ok: true });
    }

    if (method === "DELETE" && url.pathname === "/messages") {
      this.state.messages = [];
      this.ctx.storage.setSync("state", this.state);
      return Response.json({ ok: true });
    }

    if (method === "POST" && url.pathname === "/memory") {
      const body = await request.json<{ fact: string }>();
      this.state.memory.push(body.fact);
      this.ctx.storage.setSync("state", this.state);
      return Response.json({ ok: true });
    }

    if (method === "POST" && url.pathname === "/tool") {
      const body = await request.json<{ tool: string; state: any }>();
      this.state.toolState[body.tool] = body.state;
      this.ctx.storage.setSync("state", this.state);
      return Response.json({ ok: true });
    }

    return new Response("Not Found", { status: 404 });
  }

  async getMessages(): Promise<Array<{ role: string; content: string; timestamp: number }>> {
    return this.state.messages.slice(-20);
  }

  async getMemory(): Promise<string[]> {
    return this.state.memory.slice(-200);
  }

  async addMemory(fact: string): Promise<void> {
    this.state.memory.push(fact);
    this.ctx.storage.setSync("state", this.state);
  }
}

export function getAgentId(chatId: number): string {
  return `agent_${chatId}`;
}

export async function getAgentDO(env: any, chatId: number): Promise<DurableObjectStub | null> {
  const id = getAgentId(chatId);
  const stub = env.AGENT.get(env.AGENT.idFromName(id));
  try {
    const res = await stub.fetch("https://fake/state");
    return stub;
  } catch {
    return null;
  }
}
