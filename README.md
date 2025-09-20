# race-schedule

公営競技のレーススケジュールを管理するAPIサーバー

## 概要

このプロジェクトは以下の公営競技のレーススケジュール、レース情報、開催場所情報を取得・管理するAPIを提供します：

- JRA（日本中央競馬会）
- NAR（地方競馬）
- 海外競馬
- 競輪
- 競艇
- オートレース

## 技術スタック

- Node.js
- TypeScript
- Cloudflare Workers（サーバーレス実行環境）
- Cloudflare R2（オブジェクトストレージ、必要に応じて）
- Cloudflare D1（軽量のSQLite互換データベース、必要に応じて）
- Wrangler（Cloudflare Workers の CLI）
- Google Calendar API（カレンダー連携）

## 前提条件

- Node.js 18以上
- pnpm
- Wrangler（Cloudflare CLI）
- Cloudflare アカウントと `wrangler` 用の認証情報（APIトークン）
- Google Calendar API の認証情報

## セットアップ

1. 依存関係のインストール

```bash
pnpm install
```

2. 環境変数の設定

以下の環境変数を設定してください：

```bash
# Google Calendar API関連
GOOGLE_CALENDAR_ID="your-calendar-id"
GOOGLE_OAUTH_CLIENT_ID="your-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
GOOGLE_OAUTH_REDIRECT_URL="your-redirect-url"

# AWS関連（ローカル開発時）
AWS_REGION="ap-northeast-1"
```

## デプロイ

Cloudflare Workers / R2 にデプロイする手順の例：

1. Cloudflare アカウントで API トークンを作成し、必要な権限（Workers, Account Settings, R2 など）を付与します。
1. ローカルで `wrangler` を使用してログイン／設定します：

```bash
# API トークンを環境変数に設定（例: macOS / zsh）
export CLOUDFLARE_API_TOKEN="your-api-token"

# または wrangler login コマンドを使って認証
wrangler login
```

1. 本リポジトリの `package.json` にデプロイ用スクリプトがある場合はそれを利用します。例：

```bash
pnpm run wrangler:deploy:production
```

1. 開発中はローカルで Workers を起動して動作確認できます：

```bash
pnpm run dev:cloudflare:local
```

1. R2 や D1 を使う場合は、Cloudflare ダッシュボードでバケット／データベースを作成し、環境変数や `wrangler.toml` を更新してください。

## テスト

```bash
# ユニットテストの実行
pnpm run test

```

## ライセンス

MIT License

---

## 運用ルール（GitHub Flow）

- 本プロジェクトはGitHub Flowに準拠したブランチ運用を行います。
- 運用フローの要点：
    1. mainブランチは常にデプロイ可能な状態を保つ
    2. 機能追加・修正は必ず `feature/xxxx` や `fix/xxxx` などのブランチを作成
    3. 作業ブランチで開発し、こまめにコミット
    4. コミット前に `pnpm run lint` を実行し、エラーが出ないことを確認
    5. 作業ブランチをリモートにpush
    6. Pull Request（PR）を作成し、レビュー・CIを通過後にmainへマージ
    7. mainブランチへの直接pushは禁止（ブランチ保護ルールで強制）

- 詳細な運用手順やコマンド例は `.github/instructions/task.instructions.md` を参照してください。
