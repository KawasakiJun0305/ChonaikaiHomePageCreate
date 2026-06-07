import Head from 'next/head';
import { useState } from 'react';
import { Mail, BookOpen, MessageCircle, CheckCircle2 } from 'lucide-react';
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `【笠間町内会HP】${formData.category}：${formData.name}様より`
    );
    const body = encodeURIComponent(
      `お名前：${formData.name}\nメール：${formData.email}\n種別：${formData.category}\n\n内容：\n${formData.message}`
    );
    window.location.href = `mailto:kasama-chonaikai@example.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
            <h2 className="text-xl font-bold text-kasama-green mb-2">メーラーが開きました</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              送信いただき、ありがとうございます。<br />
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
                ※ ご入力いただいた個人情報は、お問い合わせへの返信のみに使用し、第三者への提供は行いません。
              </p>

              <button type="submit" className="btn-primary w-full py-3 text-base text-center">
                送信する
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
