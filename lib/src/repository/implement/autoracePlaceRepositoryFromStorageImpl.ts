import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
import {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/autorace';
import { Logger } from '../../utility/logger';
import { AutoracePlaceId } from '../../utility/raceId';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * オートレースデータリポジトリの実装
 */
@injectable()
export class AutoracePlaceRepositoryFromStorageImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    constructor(
        @inject('AutoracePlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<AutoracePlaceRecord>,
    ) {}
    /**
     * オートレース開催データを取得する
     *
     * このメソッドで日付の範囲を指定してオートレース開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<AutoracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<AutoracePlaceEntity>> {
        // ファイル名リストからオートレース開催データを取得する
        const placeRecordList: AutoracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // AutoracePlaceRecordをAutoracePlaceEntityに変換
        const placeEntityList: AutoracePlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // 日付の範囲でフィルタリング
        const filteredPlaceEntityList: AutoracePlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= request.startDate &&
                    placeEntity.placeData.dateTime <= request.finishDate,
            );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
    }

    @Logger
    async registerPlaceEntityList(
        request: RegisterPlaceListRequest<AutoracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: AutoracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: AutoracePlaceRecord[] =
            request.placeEntityList.map((placeEntity) =>
                placeEntity.toRecord(),
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
    private async getPlaceRecordListFromS3(): Promise<AutoracePlaceRecord[]> {
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
            grade: headers.indexOf('grade'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: AutoracePlaceRecord[] = lines
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

                return new AutoracePlaceRecord(
                    columns[indices.id] as AutoracePlaceId,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as AutoraceRaceCourse,
                    columns[indices.grade] as AutoraceGradeType,
                );
            })
            .filter(
                (placeData): placeData is AutoracePlaceRecord =>
                    placeData !== undefined,
            )
            .filter(
                (placeData, index, self): placeData is AutoracePlaceRecord =>
                    self.findIndex((data) => data.id === placeData.id) ===
                    index,
            );

        return placeRecordList;
    }
}
