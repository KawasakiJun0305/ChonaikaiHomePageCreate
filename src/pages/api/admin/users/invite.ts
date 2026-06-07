import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSideClient, createAdminClient } from '../../../../lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: '認証が必要です' });

  const myProfile = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  if (myProfile.data?.role !== 'admin') {
    return res.status(403).json({ error: 'admin権限が必要です' });
  }

  const { email, name, role } = req.body as { email: string; name: string; role: string };
  if (!email || !name) return res.status(400).json({ error: 'email と name は必須です' });

  const admin = createAdminClient();

  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name, role: role ?? 'editor' },
  });

  if (inviteError) {
    return res.status(400).json({ error: inviteError.message });
  }

  const profile = await admin
    .from('profiles')
    .select('*')
    .eq('id', inviteData.user.id)
    .single();

  return res.status(200).json({ ok: true, profile: profile.data });
}
