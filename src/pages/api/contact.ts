import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '../../lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'メールアドレスの形式が正しくありません' });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('contact_submissions').insert({ name, email, subject, message });

  if (error) {
    console.error('contact insert error:', error);
    return res.status(500).json({ error: '送信に失敗しました' });
  }

  return res.status(200).json({ ok: true });
}
