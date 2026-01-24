# Scraping パッケージ クラス図

このドキュメントは scraping パッケージのクラス構造を記述したものです。

## アーキテクチャ概要

scraping パッケージは、レース情報や開催場情報をWebからスクレイピングし、R2ストレージにキャッシュするためのモジュールです。
レイヤードアーキテクチャを採用し、以下の層で構成されています：

- **Controller層**: HTTPリクエストを受け取り、レスポンスを返す
- **Usecase層**: ビジネスロジックを実行し、複数のServiceを統合
- **Service層**: 特定のドメイン（Place/Race）のスクレイピング処理を実行
- **Repository層**: データの保存・読み込みを担当（R2キャッシュ）
- **Gateway層**: 外部システム（Webサイト、R2）とのインタフェース
- **Entity層**: データ構造の定義

## クラス図

```mermaid
classDiagram
    %% Controller Layer
    class PlaceController {
        -placeUsecase: PlaceUsecase
        +get(searchParams: URLSearchParams): Promise~Response~
    }

    class RaceController {
        -raceUsecase: RaceUsecase
        +get(searchParams: URLSearchParams): Promise~Response~
    }

    %% Usecase Layer
    class PlaceUsecase {
        -placeService: PlaceService
        +fetch(filter): Promise~PlaceHtmlEntity[]~
        +getAllPlaces(raceType, date): Promise~PlaceHtmlEntity[]~
    }

    class RaceUsecase {
        -raceService: RaceService
        +fetch(filter): Promise~RaceHtmlEntity[]~
    }

    %% Service Layer
    class PlaceService {
        -placeHtmlRepository: IPlaceHtmlRepository
        +fetch(raceType, date): Promise~PlaceHtmlEntity[]~
    }

    class RaceService {
        -raceHtmlRepository: IRaceHtmlRepository
        +fetch(raceType, date, location?, number?): Promise~RaceHtmlEntity[]~
        -parseJra(raceType, html, date, location): RaceHtmlEntity[]
        -parseNar(html, date, location): RaceHtmlEntity[]
        -parseOverseas(html, date): RaceHtmlEntity[]
        -parseKeirin(html, date, location): RaceHtmlEntity[]
        -parseAutorace(html, date, location): RaceHtmlEntity[]
        -parseBoatrace(html, date, location): RaceHtmlEntity[]
    }

    %% Repository Layer
    class IPlaceHtmlRepository {
        <<interface>>
        +fetchPlaceHtml(raceType, date): Promise~string~
        +loadPlaceHtml(raceType, date): Promise~string | null~
        +savePlaceHtml(raceType, date, html): Promise~void~
    }

    class PlaceHtmlR2Repository {
        -r2Gateway: IR2Gateway
        -placeDataHtmlGateway: IPlaceDataHtmlGateway
        +fetchPlaceHtml(raceType, date): Promise~string~
        +loadPlaceHtml(raceType, date): Promise~string | null~
        +savePlaceHtml(raceType, date, html): Promise~void~
    }

    class IRaceHtmlRepository {
        <<interface>>
        +fetchRaceHtml(raceType, date, location?, number?): Promise~string~
        +loadRaceHtml(raceType, date, location?, number?): Promise~string | null~
        +saveRaceHtml(raceType, date, html, location?, number?): Promise~void~
    }

    class RaceHtmlR2Repository {
        -r2Gateway: IR2Gateway
        -raceDataHtmlGateway: IRaceDataHtmlGateway
        +fetchRaceHtml(raceType, date, location?, number?): Promise~string~
        +loadRaceHtml(raceType, date, location?, number?): Promise~string | null~
        +saveRaceHtml(raceType, date, html, location?, number?): Promise~void~
        -generateCacheKey(raceType, date, location?, number?): string
    }

    %% Gateway Layer
    class IR2Gateway {
        <<interface>>
        +putObject(key, body, contentType?): Promise~void~
        +getObject(key): Promise~string | null~
        +deleteObject(key): Promise~void~
    }

    class R2Gateway {
        -bucket?: R2Bucket
        +setBucket(bucket): void
        +putObject(key, body, contentType?): Promise~void~
        +getObject(key): Promise~string | null~
        +deleteObject(key): Promise~void~
    }

    class IPlaceDataHtmlGateway {
        <<interface>>
        +fetch(raceType, date): Promise~string~
    }

    class PlaceDataHtmlGateway {
        +fetch(raceType, date): Promise~string~
        -getPlaceUrlByType(raceType, date): string
    }

    class IRaceDataHtmlGateway {
        <<interface>>
        +fetch(raceType, date, location?, number?): Promise~string~
    }

    class RaceDataHtmlGateway {
        +fetch(raceType, date, location?, number?): Promise~string~
    }

    %% Entity Layer
    class PlaceHtmlEntity {
        +raceType: RaceType
        +datetime: Date
        +placeName: string
        +placeHeldDays: PlaceHeldDays | undefined
    }

    class RaceHtmlEntity {
        +raceType: RaceType
        +datetime: Date
        +location: string
        +raceNumber: number
        +raceName: string
        +grade?: string
        +distance?: number
        +surfaceType?: string
        +stage?: string
        +additionalInfo?: Record~string, unknown~
    }

    %% Relationships
    PlaceController --> PlaceUsecase
    RaceController --> RaceUsecase

    PlaceUsecase --> PlaceService
    RaceUsecase --> RaceService

    PlaceService --> IPlaceHtmlRepository
    RaceService --> IRaceHtmlRepository

    PlaceService ..> PlaceHtmlEntity : creates
    RaceService ..> RaceHtmlEntity : creates

    IPlaceHtmlRepository <|.. PlaceHtmlR2Repository
    IRaceHtmlRepository <|.. RaceHtmlR2Repository

    PlaceHtmlR2Repository --> IR2Gateway
    PlaceHtmlR2Repository --> IPlaceDataHtmlGateway
    RaceHtmlR2Repository --> IR2Gateway
    RaceHtmlR2Repository --> IRaceDataHtmlGateway

    IR2Gateway <|.. R2Gateway
    IPlaceDataHtmlGateway <|.. PlaceDataHtmlGateway
    IRaceDataHtmlGateway <|.. RaceDataHtmlGateway

```

## 各層の責務

### Controller層

- HTTPリクエストのパラメータを解析
- バリデーション
- Usecaseの呼び出し
- レスポンスのフォーマット

### Usecase層

- 複数のServiceを統合して処理を実行
- 日付範囲のループ処理
- 複数のレースタイプの統合処理

### Service層

- HTMLの取得とパース処理
- レースタイプごとの専用パース処理
- Entityの生成

### Repository層

- R2キャッシュからのHTML読み込み
- R2キャッシュへのHTML保存
- Webからの新規HTML取得

### Gateway層

- 外部WebサイトからのHTML取得
- R2ストレージへの読み書き

### Entity層

- スクレイピングで取得したデータの型定義

## 依存性注入

依存性注入は tsyringe を使用しています。
各クラスは `@injectable()` デコレータでマークされ、
コンストラクタで `@inject('InterfaceName')` により依存を注入します。

DI登録は [di.ts](../src/di.ts) で行われています。
