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
    title: '3. 第三者への提供・委託',
    body: '法令に基づく場合を除き、ご本人の同意なく第三者に個人情報を提供することはありません。なお、お問い合わせフォームの運営・データ管理のため、以下のサービスに個人情報の取り扱いを委託する場合があります。委託先には適切な安全管理措置を求めます。\n\n・Supabase, Inc.（データベース・バックエンドサービス、米国）\n\n外国にある委託先への提供について詳細をご希望の方は、お問い合わせフォームよりご連絡ください。',
  },
  {
    title: '4. 個人情報の管理・保管期間',
    body: '収集した個人情報は適切に管理し、紛失・破壊・改ざん・不正アクセスの防止に努めます。お問い合わせへの対応が完了した後は、30日以内に削除します。',
  },
  {
    title: '5. Cookie・アクセス解析',
    body: '当サイトでは、サービス改善を目的としてVercel Analyticsを使用しています。このツールはアクセス状況を収集しますが、個人を特定する情報は収集しません。アクセス解析によるデータ収集を望まない場合は、ブラウザの設定からCookieを無効にすることができます。',
  },
  {
    title: '6. 保有個人データに関するご請求',
    body: '保有個人データの開示・訂正・利用停止・消去・第三者提供停止をご希望の場合は、お問い合わせフォームよりご連絡ください。ご本人確認のうえ、法令の定める範囲で適切に対応いたします。なお、対応には最大2週間程度をいただく場合があります。',
  },
  {
    title: '7. 本ポリシーの変更',
    body: '本プライバシーポリシーは、必要に応じて改定することがあります。利用者の権利・利益に影響する変更がある場合はサイト上でお知らせします。',
  },
  {
    title: '8. 個人情報管理者',
    body: '笠間町内会（横浜市栄区笠間）\nお問い合わせ窓口：本サイトのお問い合わせフォームをご利用ください。',
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
          <p className="text-xs text-gray-400">制定日：2026年6月7日　最終更新日：2026年6月7日</p>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, body }) => (
            <section key={title} className="card">
              <h2 className="font-bold text-kasama-green text-base mb-3">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
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
