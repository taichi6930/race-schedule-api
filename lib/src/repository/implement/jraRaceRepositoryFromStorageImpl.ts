import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class JraRaceRepositoryFromStorageImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    constructor(
        @inject('JraRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<JraRaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<JraPlaceEntity>,
    ): Promise<JraRaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

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
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<JraRaceRecord[]> {
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
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split('\r').join('').split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return JraRaceRecord.create(
                        columns[indices.id],
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
                    );
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            })
            .filter(
                (raceData): raceData is JraRaceRecord => raceData !== undefined,
            );
    }

    /**
     * レースデータを登録する
     * @param raceEntityList
     */
    @Logger
    async registerRaceEntityList(
        raceEntityList: JraRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

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
            this.fileName,
        );
    }
}
