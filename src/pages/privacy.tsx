import Head from 'next/head';
import Link from 'next/link';
import { SITE_NAME } from '../lib/constants';

const sections = [
  {
    title: '1. 収集する個人情報',
    body: 'お問い合わせフォームをご利用の際に、お名前・メールアドレス・お問い合わせ内容を収集します。',
  },
  {
    title: '2. 利用目的',
    body: '収集した個人情報は、お問い合わせへの回答・ご連絡のみに使用します。それ以外の目的には使用しません。',
  },
  {
    title: '3. 第三者への提供',
    body: '法令に基づく場合を除き、ご本人の同意なく第三者に個人情報を提供することはありません。',
  },
  {
    title: '4. 個人情報の管理',
    body: '収集した個人情報は適切に管理し、紛失・破壊・改ざん・不正アクセスの防止に努めます。お問い合わせへの対応が完了した後は、速やかに削除します。',
  },
  {
    title: '5. Cookie・アクセス解析',
    body: '当サイトでは、サービス改善を目的としてアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用することがありますが、個人を特定する情報は収集しません。',
  },
  {
    title: '6. お問い合わせ・開示請求',
    body: '個人情報の開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。ご本人確認のうえ、適切に対応します。',
  },
  {
    title: '7. 本ポリシーの変更',
    body: '本プライバシーポリシーは、必要に応じて改定することがあります。重要な変更がある場合はサイト上でお知らせします。',
  },
];

export default function Privacy() {
  return (
    <>
      <Head>
        <title>{`プライバシーポリシー | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間町内会ホームページのプライバシーポリシーです。個人情報の取り扱いについて説明しています。" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1>プライバシーポリシー</h1>
          <p>個人情報の取り扱いについて</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card space-y-2 mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            笠間町内会（以下「当会」）は、お問い合わせフォームを通じてご提供いただいた個人情報を、以下の方針に従って適切に管理します。
          </p>
          <p className="text-xs text-gray-400">制定日：2026年6月7日</p>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, body }) => (
            <section key={title} className="card">
              <h2 className="font-bold text-kasama-green text-base mb-3">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-outline text-sm">
            お問い合わせはこちら
          </Link>
        </div>
      </div>
    </>
  );
}
