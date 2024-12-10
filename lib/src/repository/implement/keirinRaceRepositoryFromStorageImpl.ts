import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import { KeirinRaceId, KeirinRacePlayerId } from '../../utility/raceId';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromStorageImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    private readonly raceListFileName = 'raceList.csv';
    private readonly racePlayerListFileName = 'racePlayerList.csv';

    constructor(
        @inject('KeirinRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<KeirinRaceRecord>,
        @inject('KeirinRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<KeirinRacePlayerRecord>,
    ) {}
    /**
     * 競輪場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        // ファイル名リストから競輪選手データを取得する
        const racePlayerRecordList: KeirinRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // 競輪データを取得する
        const raceRaceRecordList: KeirinRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // 競輪データをKeirinRaceEntityに変換
        const raceEntityList: KeirinRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: KeirinRacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // KeirinRacePlayerDataのリストを生成
                const racePlayerDataList: KeirinRacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return new KeirinRacePlayerData(
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // KeirinRaceDataを生成
                const raceData = new KeirinRaceData(
                    raceRecord.name,
                    raceRecord.stage,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return new KeirinRaceEntity(
                    raceRecord.id,
                    raceData,
                    racePlayerDataList,
                );
            },
        );
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: KeirinRaceEntity[] =
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
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: KeirinRaceRecord[] =
            await this.getRaceRecordListFromS3();

        const existFetchRacePlayerRecordList: KeirinRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: KeirinRaceRecord[] = request.raceEntityList.map(
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
    private async getRaceRecordListFromS3(): Promise<KeirinRaceRecord[]> {
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

                return new KeirinRaceRecord(
                    columns[indices.id] as KeirinRaceId,
                    columns[indices.name],
                    columns[indices.stage] as KeirinRaceStage,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as KeirinRaceCourse,
                    columns[indices.grade] as KeirinGradeType,
                    parseInt(columns[indices.number]),
                );
            })
            .filter(
                (raceData): raceData is KeirinRaceRecord =>
                    raceData !== undefined,
            )
            .filter(
                (raceData, index, self): raceData is KeirinRaceRecord =>
                    self.findIndex((data) => data.id === raceData.id) === index,
            );
    }

    /**
     * レースプレイヤーデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRacePlayerRecordListFromS3(): Promise<
        KeirinRacePlayerRecord[]
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
        };

        // データ行を解析してKeirinRaceDataのリストを生成
        const keirinRacePlayerRecordList: KeirinRacePlayerRecord[] = lines
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

                return new KeirinRacePlayerRecord(
                    columns[indices.id] as KeirinRacePlayerId,
                    columns[indices.raceId] as KeirinRaceId,
                    parseInt(columns[indices.positionNumber]),
                    parseInt(columns[indices.playerNumber]),
                );
            })
            .filter(
                (
                    racePlayerRecord,
                ): racePlayerRecord is KeirinRacePlayerRecord =>
                    racePlayerRecord !== undefined,
            );
        return keirinRacePlayerRecordList;
    }
}
