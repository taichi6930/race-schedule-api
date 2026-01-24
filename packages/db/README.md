# Database Package

このパッケージはCloudflare D1データベースのマイグレーションとスキーマを管理します。

## 環境構成

- **ローカル環境**: 開発用のローカルD1データベース
- **テスト環境**: ブランチマージ時に自動デプロイ
- **本番環境**: タグ作成時に自動デプロイ

## ローカル環境のセットアップ

```bash
cd packages/db
./setup-local.sh
```

または手動で：

```bash
# マイグレーション適用
pnpm run migrations:apply:local

# マイグレーション一覧確認
bun run migrations:list:local

# DBシェルにアクセス
bun run db:shell:local
```

> 補足: これらのローカルコマンドは `packages/api/wrangler.toml` を参照して実行されます。API の開発サーバーと同じ D1 ストレージを更新するため、`wrangler dev` 実行時にテーブルが存在しないという問題を避けられます。

## マイグレーション

マイグレーションファイルは `migrations/` ディレクトリに配置されています。

### マイグレーションの適用

```bash
# ローカル環境
bun run migrations:apply:local

# テスト環境
bun run migrations:apply:test

# 本番環境
bun run migrations:apply:production
```

## デプロイフロー

### テスト環境

- `main`ブランチへのマージ時
- `packages/db/`配下に変更がある場合のみ実行

### 本番環境

- GitHubでタグが作成された時
- 前回のタグと比較して`packages/db/`配下に変更がある場合のみ実行
