# race-schedule-api

Cloudflare Workers上で動作するAPIサーバー。

## 環境構成

| 環境       | Worker名             | 用途           |
| ---------- | -------------------- | -------------- |
| test       | `race-schedule-test` | 開発・テスト用 |
| production | `race-schedule-prod` | 本番用         |

## ローカル開発

### 開発サーバーの起動

```bash
bun run dev
```

このコマンドは `wrangler dev --remote --env test` を実行し、Cloudflare上のtest環境（secrets, D1, R2）を使用してローカル開発ができます。

```
ローカルPC                         Cloudflare
┌─────────────┐                   ┌─────────────────────┐
│ wrangler dev│ ──── API ────→   │ race-schedule-test  │
│  --remote   │                   │  ├── Secrets        │
│             │ ←── 実行結果 ───  │  ├── D1 Database    │
└─────────────┘                   │  └── R2 Storage     │
                                  └─────────────────────┘
```

### 完全ローカルで開発する場合

ネットワーク接続なしで開発したい場合は、`.dev.vars`を作成してローカルモードを使用:

```bash
bun run dev:local
```

`.dev.vars`に必要な環境変数:

| 変数名                 | 説明                                      |
| ---------------------- | ----------------------------------------- |
| `GOOGLE_CLIENT_EMAIL`  | Google サービスアカウントのメールアドレス |
| `GOOGLE_PRIVATE_KEY`   | Google サービスアカウントの秘密鍵         |
| `JRA_CALENDAR_ID`      | JRA用Google CalendarのID                  |
| `NAR_CALENDAR_ID`      | NAR用Google CalendarのID                  |
| `WORLD_CALENDAR_ID`    | 海外レース用Google CalendarのID           |
| `KEIRIN_CALENDAR_ID`   | 競輪用Google CalendarのID                 |
| `AUTORACE_CALENDAR_ID` | オートレース用Google CalendarのID         |
| `BOATRACE_CALENDAR_ID` | ボートレース用Google CalendarのID         |
| `R2_ACCESS_KEY_ID`     | Cloudflare R2のアクセスキーID             |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2のシークレットアクセスキー   |
| `R2_BUCKET_NAME`       | R2バケット名                              |
| `R2_ENDPOINT`          | R2エンドポイント                          |

## デプロイ

### 初回セットアップ（1回のみ）

Cloudflare Workersにsecretsを設定する必要があります。

```bash
# test環境
./scripts/setup-secrets.sh test

# production環境
./scripts/setup-secrets.sh production
```

このスクリプトは`.dev.vars`から値を読み取り、Cloudflare Workersのsecretsとして設定します。

### デプロイ方法

#### 自動デプロイ（GitHub Actions）

| 環境       | トリガー                                              |
| ---------- | ----------------------------------------------------- |
| test       | `main`ブランチへのpush、または`deploy-test`ラベル付与 |
| production | `v*`タグのpush、または`deploy-production`ラベル付与   |

#### 手動デプロイ

```bash
# test環境
bun run deploy:test

# production環境
bun run deploy:production
```

## アーキテクチャ

```
リクエスト
    │
    ▼
Cloudflare Workers (race-schedule-test / race-schedule-prod)
    │
    ├── env.GOOGLE_PRIVATE_KEY など (Secrets)
    │
    ├── D1 Database (race-schedule-db-test / race-schedule-db-prod)
    │
    └── Google Calendar API
```

### Secretsの仕組み

1. `wrangler secret put`でCloudflareに暗号化して保存
2. Worker実行時に`env`オブジェクトとして渡される
3. コード内で`EnvStore.env.GOOGLE_PRIVATE_KEY`のようにアクセス

### 注意事項

- `.dev.vars`はgitignoreされています。リポジトリにコミットしないでください
- Secretsを更新した場合は再度`setup-secrets.sh`を実行してください
- GitHub Secretsはデプロイ時のCI環境でのみ使用され、Workerランタイムには渡されません
