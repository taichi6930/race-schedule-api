# updateRaceEntityList シーケンス図

```mermaid
sequenceDiagram
    participant Client
    participant PublicGamblingController
    participant PublicGamblingRaceDataUseCase
    participant PublicGamblingPlaceDataService
    participant PublicGamblingRaceDataService
    participant JraRaceRepositoryFromHtml
    participant IRaceDataHtmlGateway
    participant Web
    participant JraRaceRepositoryFromStorage
    participant S3Gateway

    Client->>PublicGamblingController: POST /race (startDate, finishDate, raceList)
    PublicGamblingController->>PublicGamblingController: パラメータバリデーション
    alt 全て未指定
        PublicGamblingController-->>Client: 400エラー返却
    else 日付指定
        PublicGamblingController->>PublicGamblingRaceDataUseCase: updateRaceEntityList(startDate, finishDate)
        PublicGamblingRaceDataUseCase->>PublicGamblingPlaceDataService: fetchPlaceEntityList(startDate, finishDate, Storage)
        PublicGamblingPlaceDataService-->>PublicGamblingRaceDataUseCase: placeEntityList
        PublicGamblingRaceDataUseCase->>PublicGamblingRaceDataService: fetchRaceEntityList(startDate, finishDate, Web, placeEntityList)
        PublicGamblingRaceDataService->>JraRaceRepositoryFromHtml: fetchRaceEntityList(searchFilter)
        JraRaceRepositoryFromHtml->>IRaceDataHtmlGateway: getRaceDataHtml(日付ごと)
        IRaceDataHtmlGateway->>Web: HTML取得リクエスト
        Web-->>IRaceDataHtmlGateway: HTMLレスポンス
        IRaceDataHtmlGateway-->>JraRaceRepositoryFromHtml: HTMLデータ
        JraRaceRepositoryFromHtml-->>PublicGamblingRaceDataService: raceEntityList
        PublicGamblingRaceDataService-->>PublicGamblingRaceDataUseCase: raceEntityList
        PublicGamblingRaceDataUseCase->>PublicGamblingRaceDataService: updateRaceEntityList(raceEntityList)
        PublicGamblingRaceDataService->>JraRaceRepositoryFromStorage: registerRaceEntityList(raceEntityList)
        JraRaceRepositoryFromStorage->>S3Gateway: uploadDataToS3(raceRecordList, fileName)
        S3Gateway-->>JraRaceRepositoryFromStorage: 完了
        JraRaceRepositoryFromStorage-->>PublicGamblingRaceDataService: 完了
        PublicGamblingRaceDataService-->>PublicGamblingRaceDataUseCase: 完了
        PublicGamblingRaceDataUseCase-->>PublicGamblingController: 完了
        PublicGamblingController-->>Client: 200 OK
    else raceList指定
        PublicGamblingController->>PublicGamblingRaceDataUseCase: upsertRaceEntityList(jraRaceDataList)
        PublicGamblingRaceDataUseCase->>PublicGamblingRaceDataService: updateRaceEntityList(raceEntityList)
        PublicGamblingRaceDataService->>JraRaceRepositoryFromStorage: registerRaceEntityList(raceEntityList)
        JraRaceRepositoryFromStorage->>S3Gateway: uploadDataToS3(raceRecordList, fileName)
        S3Gateway-->>JraRaceRepositoryFromStorage: 完了
        JraRaceRepositoryFromStorage-->>PublicGamblingRaceDataService: 完了
        PublicGamblingRaceDataService-->>PublicGamblingRaceDataUseCase: 完了
        PublicGamblingRaceDataUseCase-->>PublicGamblingController: 完了
        PublicGamblingController-->>Client: 200 OK
    end
    alt 例外発生
        PublicGamblingController-->>Client: 500エラー返却
    end
```
