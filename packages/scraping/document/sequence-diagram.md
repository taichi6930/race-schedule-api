# Scraping パッケージ シーケンス図

## Place取得のシーケンス図

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Router as Router
    participant PlaceController as PlaceController
    participant PlaceUsecase as PlaceUsecase
    participant PlaceService as PlaceService
    participant PlaceHtmlR2Repository as PlaceHtmlR2Repository
    participant R2Gateway as R2Gateway
    participant PlaceDataHtmlGateway as PlaceDataHtmlGateway
    participant ExternalSite as 外部サイト

    Client->>Router: GET /scraping/place?startDate=2026-01-01&finishDate=2026-01-31&raceTypeList=JRA
    Router->>PlaceController: get(searchParams)
    
    PlaceController->>PlaceController: パラメータ検証
    Note over PlaceController: - startDate, finishDate必須チェック<br/>- raceTypeList必須チェック<br/>- 日付フォーマット検証
    
    PlaceController->>PlaceUsecase: fetch(filter)
    Note over PlaceUsecase: filter = {<br/>  startDate: Date,<br/>  finishDate: Date,<br/>  raceTypeList: string[],<br/>  locationList?: string[]<br/>}
    
    loop raceTypeList毎
        alt JRAの場合
            loop 年単位でループ
                PlaceUsecase->>PlaceService: fetch(raceType, date)
                
                PlaceService->>PlaceHtmlR2Repository: loadPlaceHtml(raceType, date)
                PlaceHtmlR2Repository->>R2Gateway: getObject(key)
                Note over R2Gateway: key: "place/JRA2026.html"
                
                alt R2にキャッシュが存在
                    R2Gateway-->>PlaceHtmlR2Repository: HTML文字列
                    PlaceHtmlR2Repository-->>PlaceService: HTML文字列
                else R2にキャッシュが無い
                    R2Gateway-->>PlaceHtmlR2Repository: null
                    PlaceHtmlR2Repository->>PlaceDataHtmlGateway: fetch(raceType, date)
                    PlaceDataHtmlGateway->>ExternalSite: HTTP GET (URL生成)
                    Note over PlaceDataHtmlGateway: 1秒待機（過負荷防止）
                    ExternalSite-->>PlaceDataHtmlGateway: HTML
                    PlaceDataHtmlGateway-->>PlaceHtmlR2Repository: HTML文字列
                    
                    PlaceHtmlR2Repository->>R2Gateway: putObject(key, html)
                    Note over PlaceHtmlR2Repository: 開発環境では<br/>ローカルにも保存
                    R2Gateway->>R2Gateway: R2に保存
                    PlaceHtmlR2Repository-->>PlaceService: HTML文字列
                end
                
                PlaceService->>PlaceService: HTMLパース処理
                Note over PlaceService: cheerioでパース:<br/>- table.chartWrapprer取得<br/>- 開催場と開催日を抽出<br/>- PlaceHtmlEntity[]生成
                
                PlaceService-->>PlaceUsecase: PlaceHtmlEntity[]
            end
        else NAR/OVERSEAS/KEIRIN/AUTORACE/BOATRACEの場合
            loop 月単位でループ
                PlaceUsecase->>PlaceService: fetch(raceType, date)
                Note over PlaceService: 処理はJRAと同様<br/>キャッシュキー: "place/NAR202601.html"
                PlaceService-->>PlaceUsecase: PlaceHtmlEntity[]
            end
        end
    end
    
    PlaceUsecase-->>PlaceController: PlaceHtmlEntity[]
    
    PlaceController->>PlaceController: Entity→DTO変換
    Note over PlaceController: - locationListでフィルタ<br/>- locationCodeを除外<br/>- レスポンス形式に整形
    
    PlaceController-->>Router: Response.json({count, places})
    Router-->>Client: JSON Response
```

## Race取得のシーケンス図

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Router as Router
    participant RaceController as RaceController
    participant RaceUsecase as RaceUsecase
    participant RaceService as RaceService
    participant RaceHtmlR2Repository as RaceHtmlR2Repository
    participant R2Gateway as R2Gateway
    participant RaceDataHtmlGateway as RaceDataHtmlGateway
    participant ExternalSite as 外部サイト

    Client->>Router: GET /scraping/race?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA&locationList=東京
    Router->>RaceController: get(searchParams)
    
    RaceController->>RaceController: パラメータ検証
    Note over RaceController: - startDate, finishDate必須チェック<br/>- raceTypeList必須チェック<br/>- locationList, gradeListオプション<br/>- 日付フォーマット検証
    
    RaceController->>RaceUsecase: fetch(filter)
    Note over RaceUsecase: filter = {<br/>  startDate: Date,<br/>  finishDate: Date,<br/>  raceTypeList: string[],<br/>  locationList?: string[],<br/>  gradeList?: string[]<br/>}
    
    loop raceTypeList毎
        loop locationList毎
            loop 日付範囲でループ
                RaceUsecase->>RaceService: fetch(raceType, date, location)
                
                RaceService->>RaceHtmlR2Repository: loadRaceHtml(raceType, date, location)
                RaceHtmlR2Repository->>R2Gateway: getObject(key)
                Note over R2Gateway: key: "race/JRA20260101_東京.html"
                
                alt R2にキャッシュが存在
                    R2Gateway-->>RaceHtmlR2Repository: HTML文字列
                    RaceHtmlR2Repository-->>RaceService: HTML文字列
                else R2にキャッシュが無い
                    R2Gateway-->>RaceHtmlR2Repository: null
                    RaceHtmlR2Repository->>RaceDataHtmlGateway: fetch(raceType, date, location)
                    RaceDataHtmlGateway->>ExternalSite: HTTP GET (URL生成)
                    Note over RaceDataHtmlGateway: 1秒待機（過負荷防止）
                    ExternalSite-->>RaceDataHtmlGateway: HTML
                    RaceDataHtmlGateway-->>RaceHtmlR2Repository: HTML文字列
                    
                    RaceHtmlR2Repository->>R2Gateway: putObject(key, html)
                    Note over RaceHtmlR2Repository: 開発環境では<br/>ローカルにも保存
                    R2Gateway->>R2Gateway: R2に保存
                    RaceHtmlR2Repository-->>RaceService: HTML文字列
                end
                
                RaceService->>RaceService: レースタイプ別パース処理
                
                alt JRAの場合
                    RaceService->>RaceService: parseJra(raceType, html, date, location)
                    Note over RaceService: - table.hr-tableSchedule取得<br/>- レース番号、時間抽出<br/>- レース名、グレード、距離抽出<br/>- 馬場タイプ（芝/ダート/障害）<br/>- RaceHtmlEntity[]生成
                else NARの場合
                    RaceService->>RaceService: parseNar(html, date, location)
                    Note over RaceService: NAR専用パース処理
                else OVERSEASの場合
                    RaceService->>RaceService: parseOverseas(html, date)
                    Note over RaceService: 海外競馬専用パース処理
                else KEIRINの場合
                    RaceService->>RaceService: parseKeirin(html, date, location)
                    Note over RaceService: 競輪専用パース処理<br/>（ステージ情報含む）
                else AUTORACEの場合
                    RaceService->>RaceService: parseAutorace(html, date, location)
                    Note over RaceService: オートレース専用パース処理<br/>（ステージ情報含む）
                else BOATRACEの場合
                    RaceService->>RaceService: parseBoatrace(html, date, location)
                    Note over RaceService: ボートレース専用パース処理<br/>（ステージ情報含む）
                end
                
                RaceService-->>RaceUsecase: RaceHtmlEntity[]
            end
        end
    end
    
    RaceUsecase-->>RaceController: RaceHtmlEntity[]
    
    RaceController->>RaceController: Entity→DTO変換
    Note over RaceController: - 必要なフィールドのみ抽出<br/>- レスポンス形式に整形
    
    RaceController-->>Router: Response.json({count, races})
    Router-->>Client: JSON Response
```

## データフロー

### Place取得のデータフロー
1. クライアントが日付範囲とraceTypeListを指定してリクエスト
2. Controllerがパラメータを検証し、Usecaseに処理を委譲
3. Usecaseがレースタイプごと、期間ごとにServiceを呼び出し
4. ServiceがRepositoryを通じてHTMLを取得（R2キャッシュ or Web）
5. ServiceがHTMLをパースしてPlaceHtmlEntityを生成
6. ControllerがEntityをDTOに変換してJSONレスポンスを返却

### Race取得のデータフロー
1. クライアントが日付範囲、raceTypeList、locationListを指定してリクエスト
2. Controllerがパラメータを検証し、Usecaseに処理を委譲
3. Usecaseがレースタイプごと、開催場ごと、日付ごとにServiceを呼び出し
4. ServiceがRepositoryを通じてHTMLを取得（R2キャッシュ or Web）
5. Serviceがレースタイプに応じた専用パース処理を実行
6. ServiceがRaceHtmlEntityを生成
7. ControllerがEntityをDTOに変換してJSONレスポンスを返却

## キャッシュ戦略

### R2キャッシュのキー設計

**Place HTML**
- JRA: `place/JRA{year}.html` (例: `place/JRA2026.html`)
- その他: `place/{raceType}{yyyyMM}.html` (例: `place/NAR202601.html`)

**Race HTML**
- 基本形式: `race/{raceType}{yyyyMMdd}_{location}.html` (例: `race/JRA20260101_東京.html`)
- レース番号指定時: `race/{raceType}{yyyyMMdd}_{location}_R{number}.html`

### ローカル開発環境
- `NODE_ENV=development` の場合、R2への保存と並行してローカルにもHTMLを保存
- ローカル保存先: `packages/scraping/.wrangler/` (packages/scraping/local_html/)

## エラーハンドリング

### Controller層
- パラメータ不足時: 400エラー
- 日付フォーマット不正時: 400エラー
- 内部エラー時: 500エラー

### Service層
- HTML取得失敗時: エラーログを出力し、空配列を返却（処理継続）
- パース失敗時: console.warnでログ出力

### Gateway層
- fetch失敗時: エラーをthrow
- R2接続失敗時: nullを返却（キャッシュなしとして処理）
