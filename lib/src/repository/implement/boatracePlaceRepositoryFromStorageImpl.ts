import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { BoatracePlaceRecord } from '../../gateway/record/boatracePlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * ボートレースデータリポジトリの実装
 */
@injectable()
export class BoatracePlaceRepositoryFromStorageImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    /**
     *
     * @param s3Gateway
     */
    public constructor(
        @inject('BoatracePlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<BoatracePlaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<BoatracePlaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const placeRecordList: BoatracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        const placeEntityList: BoatracePlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // 日付の範囲でフィルタリング
        const filteredPlaceEntityList: BoatracePlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    /**
     *
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: BoatracePlaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: BoatracePlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        const placeRecordList: BoatracePlaceRecord[] = placeEntityList.map(
            (placeEntity) => placeEntity.toRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
        for (const placeRecord of placeRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchPlaceRecordList.findIndex(
                (record) => record.id === placeRecord.id,
            );
            if (index === -1) {
                existFetchPlaceRecordList.push(placeRecord);
            } else {
                existFetchPlaceRecordList[index] = placeRecord;
            }
        }

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
    private async getPlaceRecordListFromS3(): Promise<BoatracePlaceRecord[]> {
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

        const placeRecordList: BoatracePlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): BoatracePlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        BoatracePlaceRecord.create(
                            columns[indices.id],
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
                            columns[indices.grade],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });

        return placeRecordList;
    }
}
