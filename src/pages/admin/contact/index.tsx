import { GetServerSideProps } from 'next';
import { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import { createClient } from '../../../lib/supabase';
import type { Database, ContactStatus } from '../../../types/database';
import { Mail, MailOpen, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';

type ContactRow = Database['public']['Tables']['contact_submissions']['Row'];
type Props = { initialContacts: ContactRow[] };

const statusConfig: Record<ContactStatus, { label: string; className: string }> = {
  unread:  { label: '未読',   className: 'bg-red-100 text-red-700' },
  read:    { label: '既読',   className: 'bg-gray-100 text-gray-600' },
  replied: { label: '返信済', className: 'bg-green-100 text-green-700' },
};

export default function AdminContact({ initialContacts }: Props) {
  const [contacts, setContacts] = useState(initialContacts);
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateStatus = async (id: string, status: ContactStatus) => {
    const supabase = createClient();
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const toggleExpand = async (c: ContactRow) => {
    if (expanded === c.id) {
      setExpanded(null);
      return;
    }
    setExpanded(c.id);
    if (c.status === 'unread') await updateStatus(c.id, 'read');
  };

  const unreadCount = contacts.filter((c) => c.status === 'unread').length;

  return (
    <AdminLayout title="お問い合わせ受信トレイ">
      {unreadCount > 0 && (
        <p className="text-sm text-red-600 font-semibold mb-4">未読 {unreadCount}件</p>
      )}

      <div className="space-y-2">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
            お問い合わせはまだありません
          </div>
        ) : (
          contacts.map((c) => {
            const isOpen = expanded === c.id;
            const sc = statusConfig[c.status];
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleExpand(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                >
                  {c.status === 'unread' ? (
                    <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sc.className}`}>
                        {sc.label}
                      </span>
                      <span className="font-semibold text-sm text-gray-800 truncate">{c.subject}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.name}（{c.email}）・{new Date(c.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap py-3 leading-relaxed">{c.message}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <a
                        href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                        onClick={() => updateStatus(c.id, 'replied')}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        返信する
                      </a>
                      {c.status !== 'replied' && (
                        <button
                          onClick={() => updateStatus(c.id, 'replied')}
                          className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          返信済みにする
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };

  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  return { props: { initialContacts: data ?? [] } };
};
