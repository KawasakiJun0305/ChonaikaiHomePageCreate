@echo off
REM Setup Script for Next.js Template Project (Windows)
REM このスクリプトは、新しいプロジェクトの初期セットアップを自動化します

setlocal enabledelayedexpansion

echo 🚀 Next.js Template Project セットアップを開始します...
echo.

REM Node.js バージョン確認
echo 📋 Node.js バージョン確認中...
node --version
npm --version
echo.

REM 依存パッケージをインストール
echo 📦 依存パッケージをインストール中...
call npm install
if errorlevel 1 (
    echo ❌ npm install に失敗しました
    exit /b 1
)
echo.

REM 環境変数ファイル作成
if not exist ".env.local" (
    echo 📝 .env.local ファイルを作成中...
    copy .env.example .env.local
    echo ✅ .env.local を作成しました。必要に応じて編集してください。
) else (
    echo ✅ .env.local は既に存在します。
)
echo.

REM Git 初期化（未初期化の場合）
if not exist ".git" (
    echo 🔧 Git リポジトリを初期化中...
    call git init
    call git add .
    call git commit -m "Initial commit: Next.js template project"
    if errorlevel 1 (
        echo ⚠️  Git コミットに失敗しました（Git が未インストールの可能性があります）
    ) else (
        echo ✅ Git リポジトリを初期化しました。
    )
) else (
    echo ✅ Git リポジトリは既に初期化されています。
)
echo.

REM 初期ビルド確認
echo 🏗️  ビルド確認中...
call npm run build
if errorlevel 1 (
    echo ⚠️  ビルドに警告またはエラーがありました
)
echo.

REM 設定確認
echo ✅ セットアップが完了しました！
echo.
echo 次のステップ:
echo   1. 開発サーバーを起動: npm run dev
echo   2. ブラウザで http://localhost:3000 を開く
echo   3. src/ ディレクトリでコーディングを開始
echo.
echo 📖 詳細は以下のドキュメントを参照してください:
echo   - README.md - プロジェクト概要
echo   - docs/SETUP.md - セットアップガイド
echo   - docs/DEVELOPMENT.md - 開発ガイドライン
echo.

pause
