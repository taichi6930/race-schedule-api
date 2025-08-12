import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class NarRaceRepositoryFromStorageImpl
    implements IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    private readonly raceType: RaceType = RaceType.NAR;

    public constructor(
        @inject('NarRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<HorseRacingRaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<HorseRacingPlaceEntity>,
    ): Promise<HorseRacingRaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceRecordをRaceEntityに変換
        const raceEntityList: HorseRacingRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: HorseRacingRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );
        return filteredRaceEntityList;
    }

    /**
     * レースデータをS3から取得する
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<HorseRacingRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

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
            id: headers.indexOf('id'),
            name: headers.indexOf('name'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            surfaceType: headers.indexOf('surfaceType'),
            distance: headers.indexOf('distance'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            updateDate: headers.indexOf('updateDate'),
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
                                this.raceType,
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
     * @param raceType
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3();

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
            this.fileName,
        );
    }
}
