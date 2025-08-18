import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class HorseRacingRaceRepositoryFromStorageImpl
    implements IRaceRepository<RaceEntity, PlaceEntity>
{
    private readonly fileName = CSV_FILE_NAME.RACE_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<PlaceEntity>,
    ): Promise<RaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(searchFilter.raceType);

        // フィルタリング処理（日付の範囲指定）
        return raceRecordList
            .map((raceRecord) =>
                RaceEntity.create(
                    raceRecord.id,
                    RaceData.create(
                        raceRecord.raceType,
                        raceRecord.name,
                        raceRecord.dateTime,
                        raceRecord.location,
                        raceRecord.grade,
                        raceRecord.number,
                    ),
                    undefined,
                    HorseRaceConditionData.create(
                        raceRecord.surfaceType,
                        raceRecord.distance,
                    ),
                    raceRecord.updateDate,
                ),
            )
            .filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );
    }

    /**
     * レースデータをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<HorseRacingRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.fileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split('\r').join('').split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            surfaceType: headers.indexOf(CSV_HEADER_KEYS.SURFACE_TYPE),
            distance: headers.indexOf(CSV_HEADER_KEYS.DISTANCE),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        console.log('データ行を100件ずつ分割');

        // データ行を100件ずつ分割
        const chunkSize = 100;
        const chunks: string[][] = [];
        for (let i = 1; i < lines.length; i += chunkSize) {
            chunks.push(lines.slice(i, i + chunkSize));
        }

        // 並列で処理を実行
        const results = await Promise.all(
            chunks.map((chunk) =>
                chunk.flatMap((line: string): HorseRacingRaceRecord[] => {
                    try {
                        const columns = line.split('\r').join('').split(',');

                        const updateDate = columns[indices.updateDate]
                            ? new Date(columns[indices.updateDate])
                            : getJSTDate(new Date());

                        return [
                            HorseRacingRaceRecord.create(
                                columns[indices.id],
                                raceType,
                                columns[indices.name],
                                new Date(columns[indices.dateTime]),
                                columns[indices.location],
                                columns[indices.surfaceType],
                                Number.parseInt(columns[indices.distance]),
                                columns[indices.grade],
                                Number.parseInt(columns[indices.number]),
                                updateDate,
                            ),
                        ];
                    } catch (error) {
                        console.error(error);
                        return [];
                    }
                }),
            ),
        );
        // 結果を1つにまとめ、重複を排除
        const mergedResults = results.flat();
        return mergedResults;
    }

    /**
     * レースデータを登録する
     * @param raceType - レース種別
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: RaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchRaceRecordList: HorseRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: HorseRacingRaceRecord[] = raceEntityList.map(
                (raceEntity) => raceEntity.toRaceRecord(),
            );

            // idをキーとしたMapを作成し、既存データを上書きまたは追加する
            const raceRecordMap = new Map<string, HorseRacingRaceRecord>(
                existFetchRaceRecordList.map((record) => [record.id, record]),
            );

            for (const raceRecord of raceRecordList) {
                raceRecordMap.set(raceRecord.id, raceRecord);
            }

            // Mapからリストに変換し、日付の最新順にソート
            const updatedRaceRecordList = [...raceRecordMap.values()].sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );
            // 月毎に分けられたplaceをS3にアップロードする
            await this.s3Gateway.uploadDataToS3(
                updatedRaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.fileName,
            );
            return {
                code: 200,
                message: 'Successfully registered race data',
                successData: raceEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Failed to register race data',
                successData: [],
                failureData: raceEntityList,
            };
        }
    }
}
