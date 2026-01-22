# Player Controller Migration Design

## 目的

`src/controller/playerController.ts` とその関連ファイルを `packages/api` および `packages/db` 配下に移行する。

## 現状分析

### 移行対象ファイル

以下のファイルを `src` から `packages` に移行する:

#### Controller層

- `src/controller/playerController.ts` → `packages/api/src/controller/playerController.ts`

#### UseCase層

- `src/usecase/interface/IPlayerUsecase.ts` → `packages/api/src/usecase/interface/IPlayerUsecase.ts`
- `src/usecase/implement/playerUsecase.ts` → `packages/api/src/usecase/implement/playerUsecase.ts`

#### Service層

- `src/service/interface/IPlayerService.ts` → `packages/api/src/service/interface/IPlayerService.ts`
- `src/service/implement/playerService.ts` → `packages/api/src/service/implement/playerService.ts`

#### Repository層

- `src/repository/interface/IPlayerRepository.ts` → `packages/api/src/repository/interface/IPlayerRepository.ts`
- `src/repository/implement/playerRepository.ts` → `packages/api/src/repository/implement/playerRepository.ts`

#### Entity層

- `src/repository/entity/playerEntity.ts` → `packages/api/src/domain/entity/playerEntity.ts`
- `src/repository/entity/filter/searchPlayerFilterEntity.ts` → `packages/api/src/domain/entity/filter/searchPlayerFilterEntity.ts`

#### Utility層

- `src/utility/cors.ts` → `packages/api/src/utility/cors.ts` (新規作成)
- `src/controller/requestParser.ts` の関数を → `packages/api/src/utility/validation.ts` (新規作成、必要な関数のみ抽出)

### 依存関係

- **RaceType**: `@race-schedule/shared/src/types/raceType`
- **Logger**: `@race-schedule/shared/src/utilities/logger`
- **DBGateway**: `packages/api/src/gateway/interface/IDBGateway`
- **tsyringe**: DI コンテナ
- **zod**: バリデーション

## 設計

### 1. データベーススキーマ (packages/db)

#### playerテーブル

```sql
CREATE TABLE IF NOT EXISTS player (
    race_type TEXT NOT NULL,
    player_no TEXT NOT NULL,
    player_name TEXT NOT NULL,
    priority INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (race_type, player_no)
);

CREATE INDEX idx_player_race_type ON player(race_type);
CREATE INDEX idx_player_priority ON player(priority);
```

### 2. API構造 (packages/api)

#### ディレクトリ構造

```
packages/api/src/
├── controller/
│   └── playerController.ts
├── usecase/
│   ├── interface/
│   │   └── IPlayerUsecase.ts
│   └── implement/
│       └── playerUsecase.ts
├── service/
│   ├── interface/
│   │   └── IPlayerService.ts
│   └── implement/
│       └── playerService.ts
├── repository/
│   ├── interface/
│   │   └── IPlayerRepository.ts
│   └── implement/
│       └── playerRepository.ts
├── domain/
│   └── entity/
│       ├── playerEntity.ts
│       └── filter/
│           └── searchPlayerFilterEntity.ts
├── utility/
│   ├── cors.ts
│   └── validation.ts
├── di.player.ts
└── router.ts (更新)
```

#### レイヤー構成

```
Request
   ↓
Controller (playerController.ts)
   - リクエストのバリデーション (zod)
   - レスポンスの生成
   - CORS対応
   ↓
UseCase (playerUsecase.ts)
   - ビジネスロジックの調整
   - ロギング
   ↓
Service (playerService.ts)
   - ビジネスロジックの実装
   - リポジトリの呼び出し
   ↓
Repository (playerRepository.ts)
   - DBGateway経由でD1にアクセス
   - SQLクエリの構築
   - Entity変換
   ↓
D1 Database (player テーブル)
```

### 3. APIエンドポイント

#### GET /player

選手データの取得

**リクエスト:**

```
GET /player?raceType=JRA&raceType=NAR
```

**レスポンス:**

```json
{
    "count": 2,
    "players": [
        {
            "raceType": "JRA",
            "playerNo": "12345",
            "playerName": "選手A",
            "priority": 1
        },
        {
            "raceType": "NAR",
            "playerNo": "67890",
            "playerName": "選手B",
            "priority": 2
        }
    ]
}
```

#### POST /player

選手データの登録/更新

**リクエスト (単体):**

```json
{
    "race_type": "JRA",
    "player_no": "12345",
    "player_name": "選手A",
    "priority": 1
}
```

**リクエスト (配列):**

```json
[
    {
        "race_type": "JRA",
        "player_no": "12345",
        "player_name": "選手A",
        "priority": 1
    },
    {
        "race_type": "NAR",
        "player_no": "67890",
        "player_name": "選手B",
        "priority": 2
    }
]
```

**レスポンス:**

```json
{
  "message": "選手を登録/更新しました",
  "playerEntities": [...]
}
```

### 4. DI設定

`packages/api/src/di.player.ts` を作成:

```typescript
import { container } from 'tsyringe';

import { PlayerController } from './controller/playerController';
import { DBGateway } from './gateway/implement/dbGateway';
import { PlayerRepository } from './repository/implement/playerRepository';
import { PlayerService } from './service/implement/playerService';
import { PlayerUsecase } from './usecase/implement/playerUsecase';

container.register('DBGateway', { useClass: DBGateway });
container.register('PlayerRepository', { useClass: PlayerRepository });
container.register('PlayerService', { useClass: PlayerService });
container.register('PlayerUsecase', { useClass: PlayerUsecase });

export const playerController = container.resolve(PlayerController);
```

### 5. ルーティング

`packages/api/src/router.ts` に以下を追加:

```typescript
import { playerController } from './di.player';

// router関数内に追加
if (url.pathname === '/player') {
    if (request.method === 'GET') {
        return playerController.getPlayerEntityList(url.searchParams);
    }
    if (request.method === 'POST') {
        return playerController.postUpsertPlayer(request);
    }
}
```

## 実装手順

1. **DBマイグレーション作成**
    - `packages/db/migrations/player.sqlite.sql` を作成

2. **Utilityファイル作成**
    - `packages/api/src/utility/cors.ts` を作成
    - `packages/api/src/utility/validation.ts` を作成

3. **Entity層の実装**
    - `packages/api/src/domain/entity/playerEntity.ts` を作成
    - `packages/api/src/domain/entity/filter/searchPlayerFilterEntity.ts` を作成

4. **Repository層の実装**
    - `packages/api/src/repository/interface/IPlayerRepository.ts` を作成
    - `packages/api/src/repository/implement/playerRepository.ts` を作成

5. **Service層の実装**
    - `packages/api/src/service/interface/IPlayerService.ts` を作成
    - `packages/api/src/service/implement/playerService.ts` を作成

6. **UseCase層の実装**
    - `packages/api/src/usecase/interface/IPlayerUsecase.ts` を作成
    - `packages/api/src/usecase/implement/playerUsecase.ts` を作成

7. **Controller層の実装**
    - `packages/api/src/controller/playerController.ts` を作成

8. **DI設定**
    - `packages/api/src/di.player.ts` を作成

9. **ルーティング更新**
    - `packages/api/src/router.ts` を更新

10. **src配下の削除**
    - 移行元のファイルを削除

## 変更点

### インポートパスの更新

- `../../../packages/shared/src/...` → `@race-schedule/shared/src/...`
- `../../../packages/api/src/...` → 相対パス (packages/api内では)
- `repository/entity` → `domain/entity` (命名の統一)

### CORS処理の統一

- 既存の `packages/api/src/controller` では個別に CORS ヘッダーを設定しているケースがあるため、統一的な utility を提供

### Validation処理の統一

- `ValidationError` クラスと `parseRaceTypeListFromSearch` を utility に移動し、他のコントローラーでも利用可能にする

## テスト戦略

1. **ユニットテスト**
    - 各レイヤーのテスト (既存のテストを移行)

2. **統合テスト**
    - GET /player エンドポイントのテスト
    - POST /player エンドポイントのテスト (単体/配列)
    - バリデーションエラーのテスト

3. **マイグレーションテスト**
    - ローカル環境でのマイグレーション実行
    - テーブル作成の確認

## 注意事項

1. **後方互換性**: src 配下のコードが他から参照されている可能性があるため、削除前に全体の依存関係を確認する
2. **環境変数**: EnvStore が正しく設定されていることを確認
3. **型安全性**: RaceType の型は `@race-schedule/shared` から参照し、一貫性を保つ
4. **エラーハンドリング**: ValidationError とその他のエラーを適切に処理
5. **DIコンテナ**: 既存の DBGateway の登録との競合を避ける (既に di.place.ts などで登録されている場合)

## 成果物

- `packages/db/migrations/player.sqlite.sql`
- `packages/api/src/` 配下の player 関連ファイル一式
- `packages/api/src/utility/` 配下の共通ユーティリティ
- 更新された `packages/api/src/router.ts`
- この設計書
