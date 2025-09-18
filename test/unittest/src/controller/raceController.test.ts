/*
ディシジョンテーブル: getRaceEntityList

| No. | searchParams | parseQueryToFilter | usecase.fetchRaceEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|--------------------|----------------------------|----------------------------|----------|
| 1   | 正常         | 成功               | 成功                       | races配列返却              | 200      |
| 2   | 正常         | 成功               | 例外                       | Internal Server Error      | 500      |
| 3   | 正常         | ValidationError    | -                          | Bad Request: メッセージ    | 400      |
| 4   | 正常         | その他例外         | -                          | Internal Server Error      | 500      |
| 5   | 不正         | ValidationError    | -                          | Bad Request: メッセージ    | 400      |

ディシジョンテーブル: postUpsertRace

| No. | request.body | parseBodyToFilter | usecase.upsertRaceEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|-------------------|-----------------------------|----------------------------|----------|
| 1   | 正常         | 成功              | 成功                        | Upsert completed, successCount, failureCount, failures | 200 |
| 2   | 正常         | 成功              | 例外                        | Internal Server Error      | 500      |
| 3   | 正常         | ValidationError   | -                           | Bad Request: メッセージ    | 400      |
| 4   | 正常         | その他例外        | -                           | Internal Server Error      | 500      |
| 5   | 不正         | ValidationError   | -                           | Bad Request: メッセージ    | 400      |
*/

it('ダミーテスト', () => {
    expect(true).toBe(true);
});
