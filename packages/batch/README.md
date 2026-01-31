# @race-schedule/batch

バッチ処理: スクレイピングAPIからデータを取得してメインAPIに流し込むスクリプト

## 概要

ローカルでバッチの動作確認を行う際、スクレイピングとメインAPIはプロジェクトのテスト環境（test）にデプロイされているものを利用できます。

## 前提

- Node.js (このリポジトリはワークスペース管理されています)
- ルートワークスペースの依存関係がインストール済みであること


## 環境設定（Cloud優先）

このバッチは「CloudflareやAWS SSM（Parameter Store）などクラウド上の環境変数」を最優先で利用します。

### 優先順位

1. **AWS SSM Parameter Store**
  - `SCRAPING_API_URL` `MAIN_API_URL` などを SSM から取得し、process.env にセットします。
  - SSMのパスprefixは `SSM_PREFIX` 環境変数で指定できます（例: `/race-schedule/dev/`）。
  - 例: SSMに `/race-schedule/dev/SCRAPING_API_URL` というパラメータがあれば自動で取得します。
2. **OS環境変数**
  - コマンド実行時に `SCRAPING_API_URL=... npx tsx ...` のように明示的に指定した場合、それが最優先されます。
3. **dotenvファイル**
  - SSMやOS環境変数で取得できなかったものだけ `.env` または `.env.test` から読み込みます。
  - `BATCH_USE_TEST=true` の場合は `.env.test` を、それ以外は `.env` を読み込みます。
4. **TEST_* 変数**
  - `BATCH_USE_TEST=true` の場合、`TEST_SCRAPING_API_URL` / `TEST_MAIN_API_URL` で上書きできます。

### SSM利用例

AWS認証情報（profile, accessKey, region等）はAWS SDKの標準仕様に従います。

```
export SSM_PREFIX=/race-schedule/dev/
npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
```

### それ以外の利用例

従来通り、`.env` や `.env.test` も利用可能です。

```
BATCH_USE_TEST=true npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
```

または

```
SCRAPING_API_URL=https://xxx MAIN_API_URL=https://yyy npx tsx src/cli.ts ...
```

サンプルのテンプレートファイルを `packages/batch/.env.example` と `packages/batch/.env.test.example` に用意しています。実際のURLに書き換えて使用してください。

## 実行方法

- 単発実行（ローカルデフォルト）:

```
npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
```

- テスト環境のスクレイピング/APIを使う:

```
BATCH_USE_TEST=true npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
```

または `.env.test` を作成してから実行してください。

## Lint

コミット前に lint を実行してください:

```
bun run lint
```

エラーがあれば `bun run lint:fix` を試してください。

## 追加メモ

テスト環境の実際のURLはチームのデプロイ設定に従ってください。秘匿情報はリポジトリに直接コミットしないでください。

## ワークフロー図

環境ごとのエンドポイント決定ロジックはワークフロー図で確認できます:

- [Batch ワークフロー図](WORKFLOW.md)
