# Scraping Worker

レースデータのスクレイピングを行うCloudflare Workerです。

## デプロイされるURL

- **テスト環境**: `https://race-schedule-scraping-test.race-schedule.workers.dev`
- **本番環境**: `https://race-schedule-scraping-prod.race-schedule.workers.dev`

## エンドポイント

### GET /health

ヘルスチェック用エンドポイント

```bash
curl https://race-schedule-scraping-test.race-schedule.workers.dev/health
```

### GET /scraping/place

開催場情報を取得

**パラメータ:**

- `startDate`: 開始日 (YYYY-MM-DD)
- `finishDate`: 終了日 (YYYY-MM-DD)
- `raceTypeList`: レース種別 (カンマ区切り、例: JRA,NAR)

```bash
curl "https://race-schedule-scraping-test.race-schedule.workers.dev/scraping/place?startDate=2026-01-01&finishDate=2026-12-31&raceTypeList=JRA"
```

### GET /scraping/race

レース情報を取得

**パラメータ:**

- `startDate`: 開始日 (YYYY-MM-DD)
- `finishDate`: 終了日 (YYYY-MM-DD)
- `raceTypeList`: レース種別 (カンマ区切り)
- `location`: 開催場所 (オプション)

```bash
curl "https://race-schedule-scraping-test.race-schedule.workers.dev/scraping/race?startDate=2026-01-27&finishDate=2026-01-29&raceTypeList=JRA&location=東京"
```

## ローカル開発

```bash
# 開発サーバー起動
bun run dev

# ローカルでテスト
curl "http://localhost:8787/scraping/place?startDate=2026-01-01&finishDate=2026-12-31&raceTypeList=JRA"
```

## デプロイ

### 自動デプロイ

- **テスト環境**: `main`ブランチに`packages/scraping/`または`packages/shared/`の変更がマージされると自動デプロイ
- **本番環境**: タグ作成時に自動デプロイ（変更がある場合のみ）

### 手動デプロイ

```bash
# テスト環境
bun run deploy:test

# 本番環境
bun run deploy:production
```

### GitHub Actionsでデプロイ

PRやIssueに以下のラベルを付与することで手動デプロイ可能:

- `deploy-scraping-test`: テスト環境にデプロイ

## 環境変数

以下のGitHub Secretsが必要です:

- `CLOUDFLARE_API_TOKEN`: Cloudflare APIトークン
- `CLOUDFLARE_ACCOUNT_ID`: CloudflareアカウントID

## R2バケット

スクレイピングしたHTMLを保存するためのR2バケット:

- **テスト**: `race-schedule-scraping-html-test`
- **本番**: `race-schedule-scraping-html-prod`
- **ローカル/プレビュー**: `race-schedule-scraping-html-preview`

## 技術スタック

- Cloudflare Workers
- TypeScript
- tsyringe (DI)
- cheerio (HTMLパース)
- Cloudflare R2 (ストレージ)
