# API ドキュメント

Next.js API Routes を使用して実装されたバックエンド API のドキュメント。

## ベース URL

```
http://localhost:3000/api
```

## エンドポイント一覧

### 1. Hello API

テスト用のシンプルなエンドポイント。

#### リクエスト

```http
GET /api/hello
```

#### レスポンス

```json
{
  "message": "Hello from Next.js API",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### ステータスコード

- `200 OK` - リクエスト成功

---

## API リクエスト例

### JavaScript / TypeScript

```typescript
const response = await fetch('/api/hello');
const data = await response.json();
console.log(data);
```

### curl

```bash
curl http://localhost:3000/api/hello
```

---

## 認証

現在、このテンプレートには認証機能がありません。
必要に応じて、以下を実装してください：

- JWT トークン認証
- API キー認証
- OAuth 2.0

例：JWT トークンの検証

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

function verifyToken(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return false;

  try {
    // JWT を検証
    return true;
  } catch {
    return false;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ハンドラーロジック
}
```

---

## エラーハンドリング

API は以下のエラーレスポンスを返します：

### 400 Bad Request

```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## API 開発ガイド

### 新しいエンドポイント作成例

```typescript
// src/pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<User | { error: string }>) {
  const { id } = req.query;

  // バリデーション
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // メソッド別処理
  if (req.method === 'GET') {
    // GET: ユーザー情報取得
    const user: User = {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
    };
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    // PUT: ユーザー情報更新
    return res.status(200).json({ ...req.body, id });
  }

  if (req.method === 'DELETE') {
    // DELETE: ユーザー削除
    return res.status(204).end();
  }

  // メソッド未対応
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
```

### Dynamic Routes

URL パラメータを使用する場合：

```typescript
// src/pages/api/posts/[id].ts
const { id } = req.query; // URL パラメータを取得
```

クエリパラメータを使用する場合：

```typescript
const { page, limit } = req.query; // ?page=1&limit=10
```

### リクエストボディ

```typescript
if (req.method === 'POST') {
  const { name, email } = req.body;
  // バリデーション
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
}
```

### ヘッダー操作

```typescript
// レスポンスヘッダーを設定
res.setHeader('X-Custom-Header', 'value');
res.setHeader('Cache-Control', 'no-store');

// リクエストヘッダーを読み取り
const userAgent = req.headers['user-agent'];
const token = req.headers.authorization;
```

---

## レート制限

レート制限を実装する場合の例：

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分
  max: 100, // 最大 100 リクエスト
});

export default limiter(handler);
```

---

## テスト例

Jest でのテスト：

```typescript
// __tests__/api/hello.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/hello';

describe('/api/hello', () => {
  it('returns hello message', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Hello from Next.js API');
  });
});
```

---

## デプロイに関する注意

- 環境変数は `.env.local` に設定してください
- 本番環境では HTTPS を使用してください
- API キーや機密情報をコードに埋め込まないでください
