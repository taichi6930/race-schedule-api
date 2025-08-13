import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraHeldDayRecord } from '../../gateway/record/jraHeldDayRecord';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class JraPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly placeFileName = 'placeList.csv';
    private readonly heldDayFileName = 'heldDayList.csv';

    private readonly raceType: RaceType = RaceType.JRA;

    public constructor(
        @inject('JraPlaceS3Gateway')
        private readonly placeS3Gateway: IS3Gateway<JraPlaceRecord>,
        @inject('JraHeldDayS3Gateway')
        private readonly heldDayS3Gateway: IS3Gateway<JraHeldDayRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // 開催データを取得
        const placeRecordList: JraPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        const heldDayRecordList: JraHeldDayRecord[] =
            await this.getHeldDayRecordListFromS3(searchFilter.raceType);

        // placeRecordListのidと、heldDayRecordListのidが一致するものを取得
        const recordMap = new Map<
            string,
            {
                placeRecord: JraPlaceRecord;
                heldDayRecord: JraHeldDayRecord;
            }
        >();

        // 量を減らすために、日付の範囲でフィルタリング
        for (const placeRecord of placeRecordList.filter(
            (_placeRecord) =>
                _placeRecord.dateTime >= searchFilter.startDate &&
                _placeRecord.dateTime <= searchFilter.finishDate,
        )) {
            const heldDayRecord = heldDayRecordList.find(
                (record) => record.id === placeRecord.id,
            );
            if (!heldDayRecord) {
                // heldDayRecordが見つからない場合はスキップ
                continue;
            }
            recordMap.set(placeRecord.id, { placeRecord, heldDayRecord });
        }

        // raceEntityListに変換
        const placeEntityList: JraPlaceEntity[] = [...recordMap.values()].map(
            ({ placeRecord, heldDayRecord }) => {
                return JraPlaceEntity.create(
                    placeRecord.id,
                    heldDayRecord.raceType,
                    PlaceData.create(
                        heldDayRecord.raceType,
                        placeRecord.dateTime,
                        placeRecord.location,
                    ),
                    HeldDayData.create(
                        heldDayRecord.heldTimes,
                        heldDayRecord.heldDayTimes,
                    ),
                    // placeRecordとheldDayRecordのupdateDateの早い方を使用
                    new Date(
                        Math.min(
                            placeRecord.updateDate.getTime(),
                            heldDayRecord.updateDate.getTime(),
                        ),
                    ),
                );
            },
        );
        return placeEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: JraPlaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: JraPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        const placeRecordList: JraPlaceRecord[] = placeEntityList.map(
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

        await this.placeS3Gateway.uploadDataToS3(
            existFetchPlaceRecordList,
            this.placeFileName,
        );
    }

    /**
     * 開催場データをS3から取得する
     */
    @Logger
    private async getPlaceRecordListFromS3(): Promise<JraPlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.placeS3Gateway.fetchDataFromS3(
            this.placeFileName,
        );

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
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析して PlaceData のリストを生成
        const placeRecordList: JraPlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): JraPlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        JraPlaceRecord.create(
                            columns[indices.id],
                            this.raceType,
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
                            Number.parseInt(columns[indices.heldTimes], 10),
                            Number.parseInt(columns[indices.heldDayTimes], 10),
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

    /**
     * 開催場データをS3から取得する
     * @param raceType
     */
    @Logger
    private async getHeldDayRecordListFromS3(
        raceType: RaceType,
    ): Promise<JraHeldDayRecord[]> {
        // S3からデータを取得する
        const csv = await this.heldDayS3Gateway.fetchDataFromS3(
            this.heldDayFileName,
        );

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
            raceType: headers.indexOf('raceType'),
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析して JraHeldDayRecord のリストを生成
        const heldDayRecordList: JraHeldDayRecord[] = lines
            .slice(1)
            .flatMap((line: string): JraHeldDayRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        JraHeldDayRecord.create(
                            columns[indices.id],
                            this.raceType,
                            Number.parseInt(columns[indices.heldTimes], 10),
                            Number.parseInt(columns[indices.heldDayTimes], 10),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return heldDayRecordList;
    }
}
