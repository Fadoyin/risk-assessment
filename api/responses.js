import { kv } from '@vercel/kv';

const RESPONSES_KEY = 'risk-responses:all';

async function readResponses() {
  const entries = await kv.get(RESPONSES_KEY);
  return Array.isArray(entries) ? entries : [];
}

async function writeResponses(entries) {
  await kv.set(RESPONSES_KEY, entries);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const entries = await readResponses();
      entries.sort((a, b) => b.submittedAt - a.submittedAt);
      return res.status(200).json(entries);
    }

    if (req.method === 'POST') {
      const entry = req.body;
      if (!entry?.key || !entry?.text) {
        return res.status(400).json({ error: 'Invalid response payload' });
      }

      const entries = await readResponses();
      entries.push(entry);
      await writeResponses(entries);
      return res.status(201).json(entry);
    }

    if (req.method === 'DELETE') {
      const key = req.query.key;
      if (!key) {
        return res.status(400).json({ error: 'Missing key' });
      }

      const entries = await readResponses();
      const next = entries.filter((entry) => entry.key !== key);
      await writeResponses(next);
      return res.status(200).json({ deleted: key });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Responses API error:', error);
    return res.status(500).json({ error: 'Storage unavailable' });
  }
}
