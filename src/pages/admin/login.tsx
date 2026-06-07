import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';
import { createClient } from '../../lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('メールアドレスまたはパスワードが違います');
      setLoading(false);
      return;
    }

    router.push(redirect);
  }

  return (
    <>
      <Head>
        <title>管理者ログイン — 笠間町内会</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-kasama-green to-kasama-darkgreen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-kasama-green text-center mb-1">笠間町内会</h1>
          <p className="text-sm text-gray-400 text-center mb-6">管理者ログイン</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@example.com"
                autoComplete="email"
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="パスワード"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
