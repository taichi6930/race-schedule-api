import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class JraRaceRepositoryFromStorageImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    private readonly fileName = CSV_FILE_NAME.RACE_LIST;

    public constructor(
        @inject('JraRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<JraRaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<JraPlaceEntity>,
    ): Promise<JraRaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3(searchFilter.raceType);

        // RaceRecordをRaceEntityに変換
        const raceEntityList: JraRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: JraRaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                getJSTDate(raceEntity.raceData.dateTime) >=
                    getJSTDate(searchFilter.startDate) &&
                getJSTDate(raceEntity.raceData.dateTime) <=
                    getJSTDate(searchFilter.finishDate),
        );
        return filteredRaceEntityList;
    }

    /**
     * レースデータをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<JraRaceRecord[]> {
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
            heldTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_TIMES),
            heldDayTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_DAY_TIMES),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines.slice(1).flatMap((line: string): JraRaceRecord[] => {
            try {
                const columns = line.split('\r').join('').split(',');

                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return [
                    JraRaceRecord.create(
                        columns[indices.id],
                        raceType,
                        columns[indices.name],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        columns[indices.surfaceType],
                        Number.parseInt(columns[indices.distance]),
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        Number.parseInt(columns[indices.heldTimes]),
                        Number.parseInt(columns[indices.heldDayTimes]),
                        updateDate,
                    ),
                ];
            } catch (error) {
                console.error(error);
                return [];
            }
        });
    }

    /**
     * レースデータを登録する
     * @param raceType - レース種別
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: JraRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraRaceEntity[];
        failureData: JraRaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchRaceRecordList: JraRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: JraRaceRecord[] = raceEntityList.map(
                (raceEntity) => raceEntity.toRaceRecord(),
            );

            // idが重複しているデータは上書きをし、新規のデータは追加する
            for (const raceRecord of raceRecordList) {
                // 既に登録されているデータがある場合は上書きする
                const index = existFetchRaceRecordList.findIndex(
                    (record) => record.id === raceRecord.id,
                );
                if (index === -1) {
                    existFetchRaceRecordList.push(raceRecord);
                } else {
                    existFetchRaceRecordList[index] = raceRecord;
                }
            }

            // 日付の最新順にソート
            existFetchRaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            await this.s3Gateway.uploadDataToS3(
                existFetchRaceRecordList,
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
