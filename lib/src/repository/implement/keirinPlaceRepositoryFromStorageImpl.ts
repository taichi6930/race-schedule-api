import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { KeirinPlaceRecord } from '../../gateway/record/keirinPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { SearchFilterEntity } from '../entity/searchFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競輪データリポジトリの実装
 */
@injectable()
export class KeirinPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    constructor(
        @inject('KeirinPlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<KeirinPlaceRecord>,
    ) {}
    /**
     * 競輪開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競輪開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<KeirinPlaceEntity[]> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchFilterEntity,
    ): Promise<KeirinPlaceEntity[]> {
        // ファイル名リストから競輪開催データを取得する
        const placeRecordList: KeirinPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // KeirinPlaceRecordをKeirinPlaceEntityに変換
        const placeEntityList: KeirinPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // 日付の範囲でフィルタリング
        const filteredPlaceEntityList: KeirinPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    @Logger
    async registerPlaceEntityList(
        placeEntityList: KeirinPlaceEntity[],
    ): Promise<RegisterPlaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: KeirinPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: KeirinPlaceRecord[] = placeEntityList.map(
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
    private async getPlaceRecordListFromS3(): Promise<KeirinPlaceRecord[]> {
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
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: KeirinPlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return KeirinPlaceRecord.create(
                        columns[indices.id],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        columns[indices.grade],
                        updateDate,
                    );
                } catch (e) {
                    console.error(e);
                    return undefined;
                }
            })
            .filter(
                (placeData): placeData is KeirinPlaceRecord =>
                    placeData !== undefined,
            );

        return placeRecordList;
    }
}
