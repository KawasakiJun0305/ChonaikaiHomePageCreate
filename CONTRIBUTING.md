# 貢献ガイド

このプロジェクトへの貢献をありがとうございます。このガイドに従うことで、効率的な開発フローを保つことができます。

## コード オブ コンダクト

すべてのコントリビューターは、包括的で尊重のある環境を維持することに同意します。

## 開始する前に

1. [README.md](./README.md) を読んでプロジェクトを理解する
2. [開発ガイドライン](./docs/DEVELOPMENT.md) を確認
3. 開発環境をセットアップ（[セットアップガイド](./docs/SETUP.md) 参照）

## 貢献の流れ

### 1. Issue を作成 / 選択

新機能またはバグ修正の場合、まず Issue を作成またはコメントして下さい：

- **バグレポート**: [Bug Report テンプレート](./.github/ISSUE_TEMPLATE/bug_report.md)
- **機能リクエスト**: [Feature Request テンプレート](./.github/ISSUE_TEMPLATE/feature_request.md)

### 2. Fork とブランチ作成

```bash
# Fork してからクローン
git clone https://github.com/your-username/TemplateProject.git
cd TemplateProject

# ブランチを作成
git checkout -b feature/my-feature
# または
git checkout -b fix/bug-name
```

### 3. コーディング

#### コード スタイル

```bash
# ESLint でリンティング
npm run lint

# Prettier でフォーマット
npm run format

# TypeScript チェック
npm run type-check
```

#### コミット メッセージ

明確なコミットメッセージを記述してください：

```
feat: ユーザー認証機能を実装

- ログインフォームを追加
- JWT トークン生成を実装
- 認証ガードミドルウェアを追加

Fixes #123
```

**プレフィックス:**

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント
- `style:` - コード スタイル
- `refactor:` - リファクタリング
- `perf:` - パフォーマンス改善
- `test:` - テスト追加
- `chore:` - その他

### 4. テストとチェック

```bash
# 単体テストを実行
npm run test

# すべてのチェックを実行
npm run lint
npm run type-check
npm run format:check
npm run test

# ビルド確認
npm run build
```

### 5. プルリクエスト (PR) を作成

PR テンプレート に従って説明を記入してください：

```markdown
## 説明

変更内容について簡潔に説明

## 変更のタイプ

- [ ] バグ修正
- [ ] 新機能
- [ ] 大きな変更

## テスト計画

実施したテスト内容

## チェックリスト

- [ ] コードをフォーマット
- [ ] ESLint チェック
- [ ] テストが成功
- [ ] ドキュメント更新（必要な場合）
```

### 6. レビュー対応

コメントにオープンに対応し、必要な変更を加えてください。

## ディレクトリ構造

新しいコンポーネントやモジュールを追加する場合、既存の構造に従ってください：

```
src/
├── components/          # UI コンポーネント
├── pages/              # ページコンポーネント
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ
├── types/              # 型定義
└── lib/                # ライブラリ
```

## パフォーマンス考慮事項

- 大きなライブラリは動的インポートを使用
- 不要な re-render を回避
- Image コンポーネントを使用（最適化）

## セキュリティ

- 機密情報（API キー、パスワード）をコードに埋め込まない
- `.env.example` で環境変数をテンプレート化
- 依存パッケージの脆弱性を確認

```bash
npm audit
npm audit fix
```

## ドキュメント

大きな変更の場合はドキュメント も更新してください：

- README.md
- docs/ ディレクトリのファイル

## 質問がある場合

- Issue でディスカッション を開始
- 既存の Issue コメントで質問

## ライセンス

このプロジェクトに貢献することで、あなたの貢献が MIT ライセンス下で公開されることに同意します。

---

貢献をお待ちしています！ 🎉
