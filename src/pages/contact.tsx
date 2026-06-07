import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, BookOpen, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { SITE_NAME } from '../lib/constants';

const contactMethods = [
  {
    Icon: Mail,
    title: 'メール',
    desc: 'フォームよりご連絡ください。通常2〜3営業日以内にご返信します。',
  },
  {
    Icon: BookOpen,
    title: '回覧板',
    desc: '緊急時は回覧板に記載の連絡先へ直接ご連絡ください。',
  },
  {
    Icon: MessageCircle,
    title: '直接相談',
    desc: '各種活動・集会の際にお声がけください。担当役員がご対応します。',
  },
];

const categories = [
  '入会について',
  '活動・イベントについて',
  'ゴミ収集について',
  '防災について',
  'ご意見・ご要望',
  'その他',
];

type FormData = {
  name: string;
  email: string;
  category: string;
  message: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: `【${formData.category}】${formData.name}様より`,
        message: formData.message,
      }),
    });

    setIsSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(true);
    }
  };

  return (
    <>
      <Head>
        <title>{`お問い合わせ | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間町内会へのお問い合わせはこちらからどうぞ。" />
        <meta property="og:title" content={`お問い合わせ | ${SITE_NAME}`} />
        <meta property="og:description" content="笠間町内会へのお問い合わせはこちらからどうぞ。" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1>お問い合わせ</h1>
          <p>ご意見・ご要望・入会のご相談など、お気軽にどうぞ</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Contact methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {contactMethods.map(({ Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-kasama-green" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-kasama-green text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form or confirmation */}
        {submitted ? (
          <div className="card text-center py-14">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-14 h-14 text-kasama-green" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-kasama-green mb-2">送信が完了しました</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              お問い合わせいただき、ありがとうございます。<br />
              担当者より順次ご返信いたします（通常2〜3営業日）。
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-outline text-sm mt-6"
            >
              もう一件送る
            </button>
          </div>
        ) : (
          <div className="card">
            <h2 className="font-bold text-kasama-green text-lg mb-6">お問い合わせフォーム</h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  autoComplete="name"
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  お問い合わせ種別 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">選択してください</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="お問い合わせ内容をご記入ください"
                  className="form-input resize-none"
                />
              </div>

              <p className="text-xs text-gray-400">
                ※ ご入力いただいた個人情報は、お問い合わせへの返信のみに使用します。
                詳しくは<Link href="/privacy" className="underline hover:text-gray-600">プライバシーポリシー</Link>をご確認ください。
              </p>

              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  送信に失敗しました。しばらく後にもう一度お試しください。
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-base text-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
