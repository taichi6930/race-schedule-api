# updateRaceDataList シーケンス図（JRA）

```mermaid
sequenceDiagram
    participant Client
    participant JraRaceController
    participant JraRaceDataUseCase
    participant JraRaceDataService
    participant JraRaceRepositoryFromStorageImpl
    participant S3Gateway

    Client->>JraRaceController: POST /race (startDate, finishDate, raceList)
    JraRaceController->>JraRaceController: パラメータのバリデーション
    alt 不正な入力
        JraRaceController-->>Client: 400エラー返却
    else startDate/finishDate指定
        JraRaceController->>JraRaceDataUseCase: updateRaceEntityList(startDate, finishDate)
        JraRaceDataUseCase->>JraRaceDataService: updateRaceEntityList(raceEntityList)
        JraRaceDataService->>JraRaceRepositoryFromStorageImpl: registerRaceEntityList(raceEntityList)
        JraRaceRepositoryFromStorageImpl->>S3Gateway: uploadDataToS3(raceRecordList, fileName)
        S3Gateway-->>JraRaceRepositoryFromStorageImpl: 完了
        JraRaceRepositoryFromStorageImpl-->>JraRaceDataService: 完了
        JraRaceDataService-->>JraRaceDataUseCase: 完了
        JraRaceDataUseCase-->>JraRaceController: 完了
        JraRaceController-->>Client: 200 OK
    else raceList指定
        JraRaceController->>JraRaceDataUseCase: upsertRaceDataList(jraRaceDataList)
        JraRaceDataUseCase->>JraRaceDataService: updateRaceEntityList(raceEntityList)
        JraRaceDataService->>JraRaceRepositoryFromStorageImpl: registerRaceEntityList(raceEntityList)
        JraRaceRepositoryFromStorageImpl->>S3Gateway: uploadDataToS3(raceRecordList, fileName)
        S3Gateway-->>JraRaceRepositoryFromStorageImpl: 完了
        JraRaceRepositoryFromStorageImpl-->>JraRaceDataService: 完了
        JraRaceDataService-->>JraRaceDataUseCase: 完了
        JraRaceDataUseCase-->>JraRaceController: 完了
        JraRaceController-->>Client: 200 OK
    end
    alt 例外発生
        JraRaceController-->>Client: 500エラー返却
    end
```
