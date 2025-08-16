import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { PlaceGradeRecord } from '../../gateway/record/PlaceGradeRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * データリポジトリの実装
 */
@injectable()
export class MechanicalRacingPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<MechanicalRacingPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly placeFileName = 'placeList.csv';
    private readonly placeGradeFileName = 'gradeList.csv';

    public constructor(
        @inject('PlaceS3Gateway')
        private readonly placeS3Gateway: IS3Gateway<PlaceRecord>,
        @inject('PlaceGradeS3Gateway')
        private readonly placeGradeS3Gateway: IS3Gateway<PlaceGradeRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        const placeGradeRecordList: PlaceGradeRecord[] =
            await this.getPlaceGradeRecordListFromS3(searchFilter.raceType);

        // placeRecordListのidと、placeRecordListのidが一致するものを取得
        const recordMap = new Map<
            string,
            {
                placeRecord: PlaceRecord;
                placeGradeRecord: PlaceGradeRecord;
            }
        >();

        // 量を減らすために、日付の範囲でフィルタリング
        for (const placeRecord of placeRecordList.filter(
            (_placeRecord) =>
                _placeRecord.dateTime >= searchFilter.startDate &&
                _placeRecord.dateTime <= searchFilter.finishDate,
        )) {
            const placeGradeRecordItem = placeGradeRecordList.find(
                (record) => record.id === placeRecord.id,
            );
            if (!placeGradeRecordItem) {
                // placeGradeRecordが見つからない場合はスキップ
                continue;
            }
            recordMap.set(placeRecord.id, {
                placeRecord,
                placeGradeRecord: placeGradeRecordItem,
            });
        }

        // raceEntityListに変換
        const placeEntityList: MechanicalRacingPlaceEntity[] = [
            ...recordMap.values(),
        ].map(({ placeRecord, placeGradeRecord }) => {
            return MechanicalRacingPlaceEntity.create(
                placeRecord.id,
                PlaceData.create(
                    searchFilter.raceType,
                    placeRecord.dateTime,
                    placeRecord.location,
                ),
                placeGradeRecord.grade,
                // placeRecordとplaceRecordのupdateDateの早い方を使用
                new Date(
                    Math.min(
                        placeRecord.updateDate.getTime(),
                        placeGradeRecord.updateDate.getTime(),
                    ),
                ),
            );
        });
        return placeEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingPlaceEntity[];
        failureData: MechanicalRacingPlaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            // PlaceEntityをPlaceRecordに変換する
            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) =>
                    PlaceRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.placeData.dateTime,
                        placeEntity.placeData.location,
                        placeEntity.updateDate,
                    ),
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
                `${raceType.toLowerCase()}/`,
                this.placeFileName,
            );

            // 既に登録されているデータを取得する
            const existFetchPlaceGradeRecordList: PlaceGradeRecord[] =
                await this.getPlaceGradeRecordListFromS3(raceType);

            // PlaceEntityをPlaceRecordに変換する
            const placeGradeRecordList: PlaceGradeRecord[] =
                placeEntityList.map((placeEntity) =>
                    PlaceGradeRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.grade,
                        placeEntity.updateDate,
                    ),
                );

            // idが重複しているデータは上書きをし、新規のデータは追加する
            for (const placeGradeRecord of placeGradeRecordList) {
                // 既に登録されているデータがある場合は上書きする
                const index = existFetchPlaceGradeRecordList.findIndex(
                    (record) => record.id === placeGradeRecord.id,
                );
                if (index === -1) {
                    existFetchPlaceGradeRecordList.push(placeGradeRecord);
                } else {
                    existFetchPlaceGradeRecordList[index] = placeGradeRecord;
                }
            }

            // 日付の最新順にソート
            existFetchPlaceGradeRecordList.sort(
                (a, b) => b.updateDate.getTime() - a.updateDate.getTime(),
            );

            await this.placeGradeS3Gateway.uploadDataToS3(
                existFetchPlaceGradeRecordList,
                `${raceType.toLowerCase()}/`,
                this.placeFileName,
            );

            return {
                code: 200,
                message: 'データの保存に成功しました',
                successData: placeEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal Server Error',
                successData: [],
                failureData: placeEntityList,
            };
        }
    }

    /**
     * 開催場データをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getPlaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceRecord[]> {
        const csv = await this.placeS3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
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
            updateDate: headers.indexOf('updateDate'),
        };

        const placeRecordList: PlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        PlaceRecord.create(
                            columns[indices.id],
                            raceType,
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
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
     * @param raceType - レース種別
     */
    @Logger
    private async getPlaceGradeRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceGradeRecord[]> {
        // S3からデータを取得する
        const csv = await this.placeGradeS3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.placeGradeFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');
        console.log('lines:', lines);
        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            raceType: headers.indexOf('raceType'),
            grade: headers.indexOf('grade'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析して PlaceGradeRecord のリストを生成
        const placeGradeRecordList: PlaceGradeRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceGradeRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        PlaceGradeRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.grade],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return placeGradeRecordList;
    }
}
