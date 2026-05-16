export const maxDuration = 300;

import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const SYSTEM_PROMPT = 'Du bist eine erfahrene Astrologin und Numerologin. Schreibe AUSSCHLIESSLICH in Schweizer Hochdeutsch: KEIN scharfes S (kein ß) -- schreibe immer ss statt ß. Schreibe tief, persoenlich und konkret. Jede Analyse soll sich wie ein persoenliches Gespraech anfuehlen. Sei grosszuegig mit Laenge und Detail.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, lead } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // ── SAVE LEAD TO REDIS (vor Stream-Start, fail-safe) ────────────
  if (lead?.email) {
    try {
      const redis = getRedis();
      if (redis) {
        const id = `lead:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
        const record = JSON.stringify({
          id,
          name: lead.name || '',
          email: lead.email || '',
          constellation: lead.constellation || '',
          focus: lead.focus || '',
          timestamp: new Date().toISOString(),
        });
        await redis.set(id, record);
        await redis.lpush('leads', id);
      }
    } catch (err) {
      console.error('Redis save error:', err.message);
    }
  }

  // ── STREAM FROM ANTHROPIC ──────────────────────────────────────
  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 6000,
        stream: true,
        messages,
      }),
    });
  } catch (err) {
    return res.status(502).json({ error: { message: 'Upstream connect failed: ' + err.message } });
  }

  if (!upstream.ok) {
    let errBody;
    try { errBody = await upstream.json(); } catch { errBody = { message: upstream.statusText }; }
    return res.status(upstream.status).json(errBody);
  }

  // Streaming headers - wichtig: X-Accel-Buffering verhindert Proxy-Buffering
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE-Events sind durch \n\n getrennt
      const parts = buffer.split('\n\n');
      buffer = parts.pop();  // letzter (evtl. unvollständiger) Event bleibt im Buffer

      for (const raw of parts) {
        if (!raw.trim()) continue;
        // Format:  event: <type>\ndata: <json>
        const lines = raw.split('\n');
        let eventType = '';
        let dataLine = '';
        for (const ln of lines) {
          if (ln.startsWith('event: ')) eventType = ln.slice(7).trim();
          else if (ln.startsWith('data: ')) dataLine = ln.slice(6);
        }
        if (!dataLine) continue;
        try {
          const obj = JSON.parse(dataLine);
          if (eventType === 'content_block_delta' && obj.delta?.type === 'text_delta') {
            res.write(obj.delta.text);
          } else if (eventType === 'error') {
            res.write('\n\n[STREAM-ERROR] ' + (obj.error?.message || 'Unbekannter Stream-Fehler'));
          }
        } catch (e) {
          // Defekter SSE-Event - ignorieren
        }
      }
    }
  } catch (streamErr) {
    try { res.write('\n\n[STREAM-ERROR] ' + streamErr.message); } catch {}
  } finally {
    res.end();
  }
}
