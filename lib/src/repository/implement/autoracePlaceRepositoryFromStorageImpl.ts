import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

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
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 開催データ取得リクエスト
     * @returns Promise<AutoracePlaceEntity[]> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<AutoracePlaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const placeRecordList: AutoracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        const placeEntityList: AutoracePlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // 日付の範囲でフィルタリング
        const filteredPlaceEntityList: AutoracePlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    @Logger
    async registerPlaceEntityList(
        placeEntityList: AutoracePlaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: AutoracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: AutoracePlaceRecord[] = placeEntityList.map(
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

        await this.s3Gateway.uploadDataToS3(
            existFetchPlaceRecordList,
            this.fileName,
        );
    }

    /**
     * 開催場データをS3から取得する
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
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: AutoracePlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split(',');

                    // updateDateが存在しない場合は現在時刻を設定
                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return AutoracePlaceRecord.create(
                        columns[indices.id],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        columns[indices.grade],
                        updateDate,
                    );
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            })
            .filter(
                (placeData): placeData is AutoracePlaceRecord =>
                    placeData !== undefined,
            );

        return placeRecordList;
    }
}
