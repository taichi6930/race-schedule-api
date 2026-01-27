# Batch Package

開催場（Place）データの定期同期バッチ処理

## 機能

- scrapingパッケージからplaceデータを取得
- apiパッケージのupsertエンドポイントにデータを流し込む
- 毎週土曜日午前9時（JST）に自動実行

## 取得データの範囲

- **JRA**: その年1年分（1/1〜12/31）
- **NAR, KEIRIN, AUTORACE**: 先月、今月、来月の3ヶ月分

## ローカル開発

### 環境変数の設定

`.dev.vars` ファイルがローカル開発用の環境変数を定義しています：

```
SCRAPING_API_URL=https://race-schedule-scraping-test.race-schedule.workers.dev
API_URL=https://race-schedule-test.race-schedule.workers.dev
```

### ローカル実行

```bash
# 開発サーバー起動
bun run dev

# HTTPリクエストで手動実行
curl http://localhost:8787/sync-place

# cronトリガーのテスト実行
bun run trigger
```

### デプロイ

```bash
# テスト環境にデプロイ
bun run deploy:test

# 本番環境にデプロイ
bun run deploy:prod
```

## エンドポイント

- `GET /health` - ヘルスチェック
- `GET /sync-place` - Place同期の手動実行（デフォルト動作）
- `GET /sync-place?startDate=YYYY-MM-DD&finishDate=YYYY-MM-DD` - 日付範囲を指定して実行
- `GET /sync-place?startDate=YYYY-MM-DD&finishDate=YYYY-MM-DD&raceTypes=JRA,NAR` - 日付範囲とraceTypeを指定して実行

### 使用例

```bash
# デフォルト実行（JRA: 1年分、NAR/KEIRIN/AUTORACE: 先月・今月・来月）
curl http://localhost:8787/sync-place

# 1ヶ月だけ取得（全raceType）
curl "http://localhost:8787/sync-place?startDate=2026-01-01&finishDate=2026-01-31"

# 特定の期間と特定のraceTypeのみ取得
curl "http://localhost:8787/sync-place?startDate=2026-01-01&finishDate=2026-01-31&raceTypes=JRA,NAR"

# 特定の1日だけ取得
curl "http://localhost:8787/sync-place?startDate=2026-01-27&finishDate=2026-01-27&raceTypes=JRA"
```

## cron設定

毎週土曜日の午前9時（JST）= 毎週土曜日の午前0時（UTC）

```
0 0 * * 6
```
