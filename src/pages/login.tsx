import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';

export default function Login() {
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirect);
    } else {
      setError('パスワードが違います');
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>笠間町内会</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-kasama-green to-kasama-darkgreen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-kasama-green text-center mb-2">笠間町内会</h1>
          <p className="text-sm text-gray-400 text-center mb-6">準備中です。パスワードを入力してください。</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="パスワード"
              autoFocus
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loading ? '確認中...' : '入る'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
