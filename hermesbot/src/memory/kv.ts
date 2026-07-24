export interface Env {
  KV: KVNamespace;
}

export async function getCachedResponse(env: Env, key: string): Promise<string | null> {
  const raw = await env.KV.get(key);
  return raw;
}

export async function setCachedResponse(env: Env, key: string, value: string, ttl?: number): Promise<void> {
  if (ttl) {
    await env.KV.put(key, value, { expirationTtl: ttl });
  } else {
    await env.KV.put(key, value);
  }
}

export async function getApiConfig(env: Env, key: string): Promise<any> {
  const raw = await env.KV.get(`api:config:${key}`);
  return raw ? JSON.parse(raw) : null;
}

export async function setApiConfig(env: Env, key: string, value: any): Promise<void> {
  await env.KV.put(`api:config:${key}`, JSON.stringify(value));
}
