import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { password } = req.body;
  const correct = process.env.SITE_PASSWORD;

  if (!correct || password !== correct) {
    return res.status(401).json({ error: 'パスワードが違います' });
  }

  res.setHeader('Set-Cookie', `site_auth=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
  return res.status(200).json({ ok: true });
}
