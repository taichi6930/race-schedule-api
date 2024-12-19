import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatraceRaceId, BoatraceRacePlayerId } from '../../utility/raceId';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    private readonly raceListFileName = 'raceList.csv';
    private readonly racePlayerListFileName = 'racePlayerList.csv';

    constructor(
        @inject('BoatraceRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<BoatraceRaceRecord>,
        @inject('BoatraceRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<BoatraceRacePlayerRecord>,
    ) {}
    /**
     * ボートレース場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<FetchRaceListResponse<BoatraceRaceEntity>> {
        // ファイル名リストからボートレース選手データを取得する
        const racePlayerRecordList: BoatraceRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // ボートレースデータを取得する
        const raceRaceRecordList: BoatraceRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // ボートレースデータをBoatraceRaceEntityに変換
        const raceEntityList: BoatraceRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: BoatraceRacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // BoatraceRacePlayerDataのリストを生成
                const racePlayerDataList: BoatraceRacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return new BoatraceRacePlayerData(
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // BoatraceRaceDataを生成
                const raceData = new BoatraceRaceData(
                    raceRecord.name,
                    raceRecord.stage,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return new BoatraceRaceEntity(
                    raceRecord.id,
                    raceData,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            },
        );
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: BoatraceRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= request.startDate &&
                    raceEntity.raceData.dateTime <= request.finishDate,
            );

        return new FetchRaceListResponse(filteredRaceEntityList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<BoatraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: BoatraceRaceRecord[] =
            await this.getRaceRecordListFromS3();

        const existFetchRacePlayerRecordList: BoatraceRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: BoatraceRaceRecord[] = request.raceEntityList.map(
            (raceEntity) => raceEntity.toRaceRecord(),
        );

        // RaceEntityをRacePlayerRecordに変換する
        const racePlayerRecordList = request.raceEntityList
            .map((raceEntity) => raceEntity.toPlayerRecordList())
            .flat();

        // raceデータでidが重複しているデータは上書きをし、新規のデータは追加する
        raceRecordList.forEach((raceRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index !== -1) {
                existFetchRaceRecordList[index] = raceRecord;
            } else {
                existFetchRaceRecordList.push(raceRecord);
            }
        });

        // racePlayerデータでidが重複しているデータは上書きをし、新規のデータは追加する
        racePlayerRecordList.forEach((racePlayerRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRacePlayerRecordList.findIndex(
                (record) => record.id === racePlayerRecord.id,
            );
            if (index !== -1) {
                existFetchRacePlayerRecordList[index] = racePlayerRecord;
            } else {
                existFetchRacePlayerRecordList.push(racePlayerRecord);
            }
        });

        // 日付の最新順にソート
        existFetchRaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // raceDataをS3にアップロードする
        await this.raceS3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.raceListFileName,
        );
        await this.racePlayerS3Gateway.uploadDataToS3(
            existFetchRacePlayerRecordList,
            this.racePlayerListFileName,
        );
        return new RegisterRaceListResponse(200);
    }

    /**
     * レースデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<BoatraceRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.raceS3Gateway.fetchDataFromS3(
            this.raceListFileName,
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
            name: headers.indexOf('name'),
            stage: headers.indexOf('stage'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.name] ||
                    isNaN(parseInt(columns[indices.number]))
                ) {
                    return undefined;
                }

                // updateDateが存在しない場合は現在時刻を設定
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return new BoatraceRaceRecord(
                    columns[indices.id] as BoatraceRaceId,
                    columns[indices.name],
                    columns[indices.stage] as BoatraceRaceStage,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as BoatraceRaceCourse,
                    columns[indices.grade] as BoatraceGradeType,
                    parseInt(columns[indices.number]),
                    updateDate,
                );
            })
            .filter(
                (raceData): raceData is BoatraceRaceRecord =>
                    raceData !== undefined,
            );
    }

    /**
     * レースプレイヤーデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRacePlayerRecordListFromS3(): Promise<
        BoatraceRacePlayerRecord[]
    > {
        // S3からデータを取得する
        const csv = await this.racePlayerS3Gateway.fetchDataFromS3(
            this.racePlayerListFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        const indices = {
            id: headers.indexOf('id'),
            raceId: headers.indexOf('raceId'),
            positionNumber: headers.indexOf('positionNumber'),
            playerNumber: headers.indexOf('playerNumber'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してBoatraceRaceDataのリストを生成
        const boatraceRacePlayerRecordList: BoatraceRacePlayerRecord[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.id] ||
                    !columns[indices.raceId] ||
                    isNaN(parseInt(columns[indices.positionNumber])) ||
                    isNaN(parseInt(columns[indices.playerNumber]))
                ) {
                    return undefined;
                }

                // updateDateが存在しない場合は現在時刻を設定
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return new BoatraceRacePlayerRecord(
                    columns[indices.id] as BoatraceRacePlayerId,
                    columns[indices.raceId] as BoatraceRaceId,
                    parseInt(columns[indices.positionNumber]),
                    parseInt(columns[indices.playerNumber]),
                    updateDate,
                );
            })
            .filter(
                (
                    racePlayerRecord,
                ): racePlayerRecord is BoatraceRacePlayerRecord =>
                    racePlayerRecord !== undefined,
            );
        return boatraceRacePlayerRecordList;
    }
}
