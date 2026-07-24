export interface Env {
  D1: D1Database;
}

export async function extractFacts(env: Env, userId: string, text: string): Promise<string[]> {
  const facts: string[] = [];
  const patterns = [
    /user (?:likes|loves|enjoys|prefers) ([^.,!?\n]+)/i,
    /user (?:studies|works at|is a|works as) ([^.,!?\n]+)/i,
    /user (?:uses|has|owns|needs) ([^.,!?\n]+)/i,
    /user (?:location|city|country) is ([^.,!?\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      facts.push(match[0].trim());
    }
  }

  const now = Date.now();
  for (const fact of facts) {
    await env.D1.prepare(
      "INSERT INTO memories (user_id, key, value, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value"
    )
      .bind(userId, fact.toLowerCase().slice(0, 64), fact, now)
      .run();
  }

  return facts;
}

export async function searchMemories(env: Env, userId: string, query: string): Promise<string[]> {
  const results = await env.D1.prepare(
    "SELECT value FROM memories WHERE user_id = ? AND value LIKE ? ORDER BY created_at DESC LIMIT 20"
  )
    .bind(userId, `%${query}%`)
    .all<{ value: string }>();

  return (results.results || []).map((r) => r.value);
}
