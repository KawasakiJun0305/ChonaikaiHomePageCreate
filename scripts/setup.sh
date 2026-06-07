#!/bin/bash

# Setup Script for Next.js Template Project
# このスクリプトは、新しいプロジェクトの初期セットアップを自動化します

set -e

echo "🚀 Next.js Template Project セットアップを開始します..."
echo ""

# Node.js バージョン確認
echo "📋 Node.js バージョン確認中..."
node --version
npm --version
echo ""

# 依存パッケージをインストール
echo "📦 依存パッケージをインストール中..."
npm install
echo ""

# 環境変数ファイル作成
if [ ! -f ".env.local" ]; then
  echo "📝 .env.local ファイルを作成中..."
  cp .env.example .env.local
  echo "✅ .env.local を作成しました。必要に応じて編集してください。"
else
  echo "✅ .env.local は既に存在します。"
fi
echo ""

# Git 初期化（未初期化の場合）
if [ ! -d ".git" ]; then
  echo "🔧 Git リポジトリを初期化中..."
  git init
  git add .
  git commit -m "Initial commit: Next.js template project"
  echo "✅ Git リポジトリを初期化しました。"
else
  echo "✅ Git リポジトリは既に初期化されています。"
fi
echo ""

# 初期ビルド確認
echo "🏗️  ビルド確認中..."
npm run build
echo ""

# 設定確認
echo "✅ セットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "  1. 開発サーバーを起動: npm run dev"
echo "  2. ブラウザで http://localhost:3000 を開く"
echo "  3. src/ ディレクトリでコーディングを開始"
echo ""
echo "📖 詳細は以下のドキュメントを参照してください:"
echo "  - README.md - プロジェクト概要"
echo "  - docs/SETUP.md - セットアップガイド"
echo "  - docs/DEVELOPMENT.md - 開発ガイドライン"
echo ""
