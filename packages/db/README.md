# Database Package

このパッケージはCloudflare D1データベースのマイグレーション、スキーマ、型定義を管理します。

## 環境構成

- **ローカル環境**: 開発用のローカルD1データベース
- **テスト環境**: ブランチマージ時に自動デプロイ
- **本番環境**: タグ作成時に自動デプロイ

## パッケージ構成

```
packages/db/
├── src/
│   ├── types/
│   │   └── schemas.ts          # テーブルスキーマの型定義
│   ├── models/
│   │   ├── place.model.ts      # Place関連のモデルヘルパー
│   │   ├── placeGrade.model.ts
│   │   ├── placeHeldDay.model.ts
│   │   ├── placeMaster.model.ts
│   │   ├── player.model.ts
│   │   └── race.model.ts
│   ├── queries/
│   │   ├── place.queries.ts    # Place関連のSQLクエリ
│   │   ├── placeMaster.queries.ts
│   │   ├── player.queries.ts
│   │   └── race.queries.ts
│   └── index.ts                # パッケージのエクスポート
├── migrations/                  # D1マイグレーションファイル
├── dist/                        # ビルド成果物（自動生成）
├── package.json
├── tsconfig.json
└── README.md
```

## 使用方法

### パッケージのインストール

他のパッケージから使用する場合：

```json
{
  "dependencies": {
    "@race-schedule/db": "workspace:*"
  }
}
```

### 型定義の使用

```typescript
import { PlaceRow, RaceRow, PlayerRow } from '@race-schedule/db';

// データベースから取得した行の型として使用
const place: PlaceRow = await db.query('SELECT * FROM place WHERE place_id = ?', [id]);
```

### クエリの使用

```typescript
import { PlaceQueries, RaceQueries } from '@race-schedule/db';

// 事前定義されたクエリを使用
const results = await db.queryAll(PlaceQueries.SELECT_PLACE_BY_ID, [placeId]);
```

### モデルヘルパーの使用

```typescript
import { generatePlaceId, isValidPlaceRow } from '@race-schedule/db';

// IDの生成
const placeId = generatePlaceId('JRA', '2024-01-01 10:00:00', '01');

// バリデーション
if (isValidPlaceRow(row)) {
  // rowはPlaceRow型として扱える
}
```

## ビルド

```bash
# ビルド
pnpm run build

# クリーン
pnpm run clean
```

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
