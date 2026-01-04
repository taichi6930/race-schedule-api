# CI: テスト実行マッピング

このドキュメントは、どのパッケージに変更があったときに CI でどのパッケージのテストを実行するかを示します。

目的: 変更の影響範囲に合わせて必要なテストのみを実行し、CI の実行時間を最適化します。

## ルール
- 変更検出は Git の差分（PR の base または main）で判定します。
- 変更があったトップレベルの `packages/<name>/` をキーとして判定します。

## マッピング
- `packages/shared` に変更があった場合 → 実行: `packages/api`, `packages/batch`, `packages/db`, `packages/front`, `packages/shared`, `packages/scraping`
- `packages/api` に変更があった場合 → 実行: `packages/batch`, `packages/db`, `packages/front`, `packages/scraping`
- `packages/front` に変更があった場合 → 実行: `packages/front`
- `packages/db` に変更があった場合 → 実行: `packages/db`
- `packages/batch` に変更があった場合 → 実行: `packages/batch`
- `packages/scraping` に変更があった場合 → 実行: `packages/scraping`

## 実装
- ワークフロー: `.github/workflows/conditional-tests.yml`
- 実装方針: 変更ファイルを検出して、該当するパッケージのテストを `pnpm --filter ./packages/<pkg> test -- --run` で順に実行します。

## 注意点
- 全てのパッケージにテストが存在することを前提としています。存在しないパッケージのテスト実行は失敗するので、新規パッケージ追加時は必ず `test` スクリプトを用意してください。
- トリガーは `push` と `pull_request`（`paths: 'packages/**'`）です。必要なら追加条件やスケジュール実行も追加可能です。

