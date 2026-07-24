export interface Env {
  D1: D1Database;
}

export interface Conversation {
  id?: number;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: number;
}

export interface Memory {
  id?: number;
  user_id: string;
  key: string;
  value: string;
  created_at: number;
}

export async function initD1(env: Env): Promise<void> {
  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
      input TEXT,
      output TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await env.D1.exec(`
    CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, created_at);
  `);

  await env.D1.exec(`
    CREATE INDEX IF NOT EXISTS idx_memories_user ON memories(user_id, key);
  `);
}

export async function addConversation(env: Env, conv: Conversation): Promise<void> {
  await env.D1.prepare(
    "INSERT INTO conversations (conversation_id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(conv.conversation_id, conv.user_id, conv.role, conv.content, conv.created_at)
    .run();
}

export async function getConversations(env: Env, userId: string, limit = 20): Promise<Conversation[]> {
  const result = await env.D1.prepare(
    "SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
  )
    .bind(userId, limit)
    .all<Conversation>();

  return result.results || [];
}

export async function getMemories(env: Env, userId: string): Promise<Memory[]> {
  const result = await env.D1.prepare(
    "SELECT * FROM memories WHERE user_id = ? ORDER BY created_at DESC"
  )
    .bind(userId)
    .all<Memory>();

  return result.results || [];
}

export async function upsertMemory(env: Env, memory: Memory): Promise<void> {
  await env.D1.prepare(
    "INSERT INTO memories (user_id, key, value, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value"
  )
    .bind(memory.user_id, memory.key, memory.value, memory.created_at)
    .run();
}

export async function getOrCreateUser(env: Env, id: string, username?: string, firstName?: string, lastName?: string): Promise<void> {
  const now = Date.now();
  await env.D1.prepare(
    "INSERT INTO users (id, username, first_name, last_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET username = excluded.username, first_name = excluded.first_name, last_name = excluded.last_name, updated_at = excluded.updated_at"
  )
    .bind(id, username ?? null, firstName ?? null, lastName ?? null, now, now)
    .run();
}
