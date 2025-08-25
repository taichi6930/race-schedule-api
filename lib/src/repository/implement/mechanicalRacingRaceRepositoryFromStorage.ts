import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { MechanicalRacingRaceRecord } from '../../gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { RaceEntity } from '../entity/raceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class MechanicalRacingRaceRepositoryFromStorage
    implements IRaceRepository
{
    // インメモリキャッシュ: key -> csv content
    private static readonly s3CsvCache = new Map<string, string>();
    private readonly raceListFileName = CSV_FILE_NAME.RACE_LIST;
    private readonly racePlayerListFileName = CSV_FILE_NAME.RACE_PLAYER_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    /**
     * 静的キャッシュをクリアする。
     * key を指定すればそのキーのみ削除、未指定なら全削除。
     * 主にテストやデータ更新時に使用する。
     * @param key - オプションのキャッシュキー
     */
    public static clearCache(key?: string): void {
        if (key) {
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.delete(key);
        } else {
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.clear();
        }
    }

    /**
     * インスタンス経由で raceType に対応するキャッシュをクリアするユーティリティ。
     * 指定しない場合は全キャッシュをクリアする。
     * @param raceType - クリア対象の raceType（未指定で全てクリア）
     */
    public clearCacheForRaceType(raceType?: RaceType): void {
        if (!raceType) {
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.clear();
            return;
        }
        const prefix = `${raceType.toLowerCase()}/`;
        for (const key of MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.keys()) {
            if (key.startsWith(prefix)) {
                MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.delete(
                    key,
                );
            }
        }
    }

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        // ファイル名リストから選手データとレースデータを並列で取得する
        const [racePlayerRecordList, raceRaceRecordList]: [
            RacePlayerRecord[],
            MechanicalRacingRaceRecord[],
        ] = await Promise.all([
            this.getRacePlayerRecordListFromS3(searchFilter.raceType),
            this.getRaceRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            ),
        ]);

        // RaceEntityに変換
        // racePlayerRecordList を raceId -> RacePlayerRecord[] の Map に変換して
        // 各 raceRecord に対する検索を O(1) にする（全体 O(n)）
        const racePlayerRecordMap = new Map<string, RacePlayerRecord[]>();
        for (const rp of racePlayerRecordList) {
            const arr = racePlayerRecordMap.get(rp.raceId);
            if (arr === undefined) {
                racePlayerRecordMap.set(rp.raceId, [rp]);
            } else {
                arr.push(rp);
            }
        }

        const raceEntityList: RaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得（Map lookup）
                const filteredRacePlayerRecordList: RacePlayerRecord[] =
                    racePlayerRecordMap.get(raceRecord.id) ?? [];
                // RacePlayerDataのリストを生成
                const racePlayerDataList: RacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) =>
                        RacePlayerData.create(
                            searchFilter.raceType,
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        ),
                    );
                // RaceDataを生成
                const raceData = RaceData.create(
                    searchFilter.raceType,
                    raceRecord.name,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return RaceEntity.create(
                    raceRecord.id,
                    raceData,
                    undefined, // heldDayDataは未設定
                    undefined, // conditionDataは未設定
                    raceRecord.stage,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            },
        );
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: RaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                raceEntity.raceData.dateTime >= searchFilter.startDate &&
                raceEntity.raceData.dateTime <= searchFilter.finishDate,
        );

        return filteredRaceEntityList;
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
            const existFetchRaceRecordList: MechanicalRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            const existFetchRacePlayerRecordList: RacePlayerRecord[] =
                await this.getRacePlayerRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: MechanicalRacingRaceRecord[] =
                raceEntityList.map((raceEntity) =>
                    raceEntity.toMechanicalRacingRaceRecord(),
                );

            // RaceEntityをRacePlayerRecordに変換する
            const racePlayerRecordList = raceEntityList.flatMap((raceEntity) =>
                raceEntity.toPlayerRecordList(),
            );

            // race データのマージ: Map を使って O(n) に改善
            const existRaceMap = new Map<string, MechanicalRacingRaceRecord>();
            for (const r of existFetchRaceRecordList) {
                existRaceMap.set(r.id, r);
            }
            for (const r of raceRecordList) {
                // 上書きまたは追加
                existRaceMap.set(r.id, r);
            }
            // Map から配列に戻す
            const mergedExistFetchRaceRecordList = [...existRaceMap.values()];

            // racePlayer データのマージ: Map を使って O(n) に改善
            const existRacePlayerMap = new Map<string, RacePlayerRecord>();
            for (const rp of existFetchRacePlayerRecordList) {
                existRacePlayerMap.set(rp.id, rp);
            }
            for (const rp of racePlayerRecordList) {
                existRacePlayerMap.set(rp.id, rp);
            }
            const mergedExistFetchRacePlayerRecordList = [
                ...existRacePlayerMap.values(),
            ];

            // 日付の最新順にソート
            mergedExistFetchRaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            // raceDataをS3にアップロードする（並列化）
            await Promise.all([
                this.s3Gateway.uploadDataToS3(
                    mergedExistFetchRaceRecordList,
                    `${raceType.toLowerCase()}/`,
                    this.raceListFileName,
                ),
                this.s3Gateway.uploadDataToS3(
                    mergedExistFetchRacePlayerRecordList,
                    `${raceType.toLowerCase()}/`,
                    this.racePlayerListFileName,
                ),
            ]);

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

    /**
     * レースデータをS3から取得する
     * @param raceType - レース種別
     * @param borderDate
     */
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
        borderDate?: Date,
    ): Promise<MechanicalRacingRaceRecord[]> {
        // S3からデータを取得する（キャッシュを優先）
        const csvKey = `${raceType.toLowerCase()}/${this.raceListFileName}`;
        let csv =
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.get(csvKey);
        if (csv === undefined) {
            csv = await this.s3Gateway.fetchDataFromS3(
                `${raceType.toLowerCase()}/`,
                this.raceListFileName,
            );
            // キャッシュに格納（空文字列や undefined も記録しておく）
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.set(
                csvKey,
                csv,
            );
        }
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
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            stage: headers.indexOf(CSV_HEADER_KEYS.STAGE),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        const result: MechanicalRacingRaceRecord[] = [];
        for (const line of lines.slice(1)) {
            try {
                const columns = line.split(',');
                const dateTime = new Date(columns[indices.dateTime]);
                if (borderDate && borderDate > dateTime) {
                    console.log(
                        'borderDateより前のデータはスキップします',
                        dateTime,
                    );
                    break;
                }
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                result.push(
                    MechanicalRacingRaceRecord.create(
                        columns[indices.id],
                        raceType,
                        columns[indices.name],
                        columns[indices.stage],
                        dateTime,
                        columns[indices.location],
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        updateDate,
                    ),
                );
            } catch (error) {
                console.error('RaceRecord create error', error);
                // continue
            }
        }
        return result;
    }

    /**
     * レースプレイヤーデータをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getRacePlayerRecordListFromS3(
        raceType: RaceType,
    ): Promise<RacePlayerRecord[]> {
        // S3からデータを取得する（キャッシュを優先）
        const csvKey = `${raceType.toLowerCase()}/${this.racePlayerListFileName}`;
        let csv =
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.get(csvKey);
        if (csv === undefined) {
            csv = await this.s3Gateway.fetchDataFromS3(
                `${raceType.toLowerCase()}/`,
                this.racePlayerListFileName,
            );
            MechanicalRacingRaceRepositoryFromStorage.s3CsvCache.set(
                csvKey,
                csv,
            );
        }

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceId: headers.indexOf(CSV_HEADER_KEYS.RACE_ID),
            positionNumber: headers.indexOf(CSV_HEADER_KEYS.POSITION_NUMBER),
            playerNumber: headers.indexOf(CSV_HEADER_KEYS.PLAYER_NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        const racePlayerRecordList: RacePlayerRecord[] = lines
            .slice(1)
            .flatMap((line: string): RacePlayerRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        RacePlayerRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.raceId],
                            Number.parseInt(columns[indices.positionNumber]),
                            Number.parseInt(columns[indices.playerNumber]),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error('RacePlayerRecord create error', error);
                    return [];
                }
            });
        return racePlayerRecordList;
    }
}
