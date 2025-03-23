import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

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
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        // 年ごとの開催データを取得
        const placeRecordList: NarPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // Entityに変換
        const placeEntityList: NarPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= searchFilter.startDate &&
                placeEntity.placeData.dateTime <= searchFilter.finishDate,
        );

        return filteredPlaceEntityList;
    }

    @Logger
    async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: NarPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: NarPlaceRecord[] = placeEntityList.map(
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
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return NarPlaceRecord.create(
                        columns[indices.id],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        updateDate,
                    );
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            })
            .filter(
                (placeData): placeData is NarPlaceRecord =>
                    placeData !== undefined,
            );

        return placeRecordList;
    }
}
