import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import { NarRaceCourse } from '../../utility/data/nar';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceId } from '../../utility/raceId';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class NarPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    constructor(
        @inject('NarPlaceS3Gateway')
        private s3Gateway: IS3Gateway<NarPlaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<NarPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<NarPlaceEntity>> {
        // 年ごとの競馬場開催データを取得
        const placeRecordList: NarPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // Entityに変換
        const placeEntityList: NarPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= request.startDate &&
                placeEntity.placeData.dateTime <= request.finishDate,
        );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
    }

    @Logger
    async registerPlaceEntityList(
        request: RegisterPlaceListRequest<NarPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: NarPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: NarPlaceRecord[] = request.placeEntityList.map(
            (placeEntity) => placeEntity.toRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
        placeRecordList.forEach((placeRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchPlaceRecordList.findIndex(
                (record) => record.id === placeRecord.id,
            );
            if (index !== -1) {
                existFetchPlaceRecordList[index] = placeRecord;
            } else {
                existFetchPlaceRecordList.push(placeRecord);
            }
        });

        // 日付の最新順にソート
        existFetchPlaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // placeをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchPlaceRecordList,
            this.fileName,
        );

        return new RegisterPlaceListResponse(200);
    }

    /**
     * レースデータをS3から取得する
     * @param request
     */
    @Logger
    private async getPlaceRecordListFromS3(): Promise<NarPlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: NarPlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.id] ||
                    !columns[indices.dateTime] ||
                    !columns[indices.location]
                ) {
                    return undefined;
                }

                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return new NarPlaceRecord(
                    columns[indices.id] as NarPlaceId,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as NarRaceCourse,
                    updateDate,
                );
            })
            .filter(
                (placeData): placeData is NarPlaceRecord =>
                    placeData !== undefined,
            );

        return placeRecordList;
    }
}
