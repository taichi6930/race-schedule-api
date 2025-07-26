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
- AWS CDK（インフラストラクチャ）
- Amazon API Gateway
- AWS Lambda
- Amazon S3（データストレージ）
- Google Calendar API（カレンダー連携）

## 前提条件

- Node.js 18以上
- pnpm
- AWS CLI（デプロイメント用）
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

## 実行方法

### ローカルでのAPI実行

1. ローカルサーバーの起動

```bash
pnpm run dev:local
```

2. APIリクエストの例

#### カレンダー情報の取得・更新

##### レーススケジュールの取得（GET）

```bash
# JRA
curl -X GET "http://localhost:3000/api/races/jra/calendar?startDate=2024-09-01&finishDate=2024-09-30"

# NAR
curl -X GET "http://localhost:3000/api/races/nar/calendar?startDate=2024-09-01&finishDate=2024-09-30"

# 競輪
curl -X GET "http://localhost:3000/api/races/keirin/calendar?startDate=2024-09-01&finishDate=2024-09-30"

# 競艇
curl -X GET "http://localhost:3000/api/races/boatrace/calendar?startDate=2024-09-01&finishDate=2024-09-30"

# オートレース
curl -X GET "http://localhost:3000/api/races/autorace/calendar?startDate=2024-09-01&finishDate=2024-09-30"
```

##### レーススケジュールの更新（POST）

```bash
# JRA
curl -X POST "http://localhost:3000/api/races/jra/calendar" \
-H "Content-Type: application/json" \
-d '{
  "startDate": "2024-09-10",
  "finishDate": "2024-09-13"
}'

# その他の競技も同様のエンドポイントで更新可能
# - /api/races/nar/calendar
# - /api/races/keirin/calendar
# - /api/races/boatrace/calendar
# - /api/races/autorace/calendar
```

#### レース情報の取得・更新

##### レース情報の取得（GET）

JRAの場合:

```bash
# 基本的な使用方法（期間指定）
curl -X GET "http://localhost:3000/api/races/jra/race?startDate=2024-09-01&finishDate=2024-09-30"

# グレードで絞り込み
curl -X GET "http://localhost:3000/api/races/jra/race?startDate=2024-09-01&finishDate=2024-09-30&grade=G1"

# 開催場所で絞り込み
curl -X GET "http://localhost:3000/api/races/jra/race?startDate=2024-09-01&finishDate=2024-09-30&location=東京"

# 複数条件での絞り込み
curl -X GET "http://localhost:3000/api/races/jra/race?startDate=2024-09-01&finishDate=2024-09-30&grade=G1&location=東京"
```

レスポンス例:

```json
[
    {
        "name": "天皇賞（秋）",
        "dateTime": "2024-10-27T15:40:00+09:00",
        "location": "東京",
        "surfaceType": "芝",
        "distance": 2000,
        "grade": "G1",
        "number": 11,
        "heldTimes": 5,
        "heldDayTimes": 8
    }
]
```

##### レース情報の更新（POST）

```bash
# 期間を指定して更新
curl -X POST "http://localhost:3000/api/races/jra/race" \
-H "Content-Type: application/json" \
-d '{
  "startDate": "2024-09-01",
  "finishDate": "2024-09-30"
}'

# 特定のレース情報を更新
curl -X POST "http://localhost:3000/api/races/jra/race" \
-H "Content-Type: application/json" \
-d '{
  "raceList": [
    {
      "name": "天皇賞（秋）",
      "dateTime": "2024-10-27T15:40:00+09:00",
      "location": "東京",
      "surfaceType": "芝",
      "distance": 2000,
      "grade": "G1",
      "number": 11,
      "heldTimes": 165,
      "heldDayTimes": 5
    }
  ]
}'
```

#### 開催場所情報の取得・更新

##### 開催場所情報の取得（GET）

```bash
# JRA
curl -X GET "http://localhost:3000/api/races/jra/place?startDate=2024-09-01&finishDate=2024-09-30"
```

レスポンス例:

```json
[
    {
        "dateTime": "2024-09-01T00:00:00+09:00",
        "location": "札幌",
        "heldTimes": 1,
        "heldDayTimes": 1
    }
]
```

##### 開催場所情報の更新（POST）

```bash
# JRA
curl -X POST "http://localhost:3000/api/races/jra/place" \
-H "Content-Type: application/json" \
-d '{
  "startDate": "2024-09-01",
  "finishDate": "2024-09-30"
}'
```

## デプロイ

AWS CDKを使用してデプロイを行います：

```bash
pnpm run cdk-deploy
```

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
