import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSideClient, createAdminClient } from '../../../../lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: '認証が必要です' });

  const myProfile = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  if (myProfile.data?.role !== 'admin') {
    return res.status(403).json({ error: 'admin権限が必要です' });
  }

  const targetId = req.query.id as string;
  if (targetId === session.user.id) {
    return res.status(400).json({ error: '自分自身は削除できません' });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(targetId);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
