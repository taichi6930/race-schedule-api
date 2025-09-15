/* eslint-disable */
import fs from 'node:fs/promises';

import { format } from 'date-fns';
import { injectable } from 'tsyringe';

import path from 'node:path';
import {
    RACE_TYPE_LIST_ALL_FOR_AWS,
    RACE_TYPE_LIST_HORSE_RACING_FOR_AWS,
    RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS,
    RACE_TYPE_LIST_WITHOUT_OVERSEAS_FOR_AWS,
    RaceType,
} from '../../../../src/utility/raceType';
import {
    defaultLocation,
    defaultPlaceGrade,
    defaultRaceDistance,
    defaultRaceGrade,
    defaultRaceName,
    defaultRaceSurfaceType,
    defaultStage,
} from '../../../../test/unittest/src/mock/common/baseCommonData';
import { CSV_HEADER_KEYS, csvPath } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { allowedEnvs, ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { generateId, IdType } from '../../utility/validateAndType/idUtility';
import { IS3Gateway } from '../interface/iS3Gateway';

/**
 * MockS3Gateway
 */
@injectable()
export class MockS3Gateway implements IS3Gateway {
    /**
     * モックデータを保存するためのマップ
     * @private
     * @type {Map<string, string>}
     */
    private static mockStorage: Map<string, string> = new Map<string, string>();

    /**
     * 初期化処理フラグ
     * @private
     * @type {boolean}
     */
    private static isInitialized = false;

    /**
     * バケット名 S3の中にあるデータの保存場所
     * @type {string}
     * @private
     */
    private readonly bucketName: string;

    // スタートの年数
    private startDate = new Date('2001-01-01');
    // 終了の年数
    private finishDate = new Date('2030-01-01');

    // helper: filesystem base dir for mock CSVs
    private readonly mockCsvBaseDir = path.join(__dirname, '../mockData/csv');

    /**
     * MockS3Gatewayのコンストラクタ
     * @param {string} bucketName
     */
    public constructor(bucketName: string) {
        this.bucketName = bucketName;
        (async () => {
            // 既にmockStorageに値が入っている場合は何もしない
            if (MockS3Gateway.isInitialized) {
                return;
            }
            // 初期化処理フラグを立てる
            MockS3Gateway.isInitialized = true;

            await this.setPlaceMockData();
            await this.setRaceMockData();
            await this.setRacePlayerMockData();
            await this.setHeldDayMockData();
            await this.setPlaceGradeMockData();
            await this.setPlayerMockData();
        })();
    }

    /**
     * モックのデータをS3にアップロードする
     * @param data
     * @param fileName
     */
    @Logger
    public async uploadDataToS3(
        data: object[],
        folderPath: string,
        fileName: string,
    ): Promise<void> {
        try {
            const csvContent = this.convertToCsv(data);
            const key = `${folderPath}${fileName}`;
            MockS3Gateway.mockStorage.set(key, csvContent);
        } catch (error) {
            console.debug(error);
            throw new Error('モックのファイルのアップロードに失敗しました');
        }
    }

    /**
     * モックのデータをS3から取得する
     * @param fileName
     */
    @Logger
    public async fetchDataFromS3(
        folderPath: string,
        fileName: string,
    ): Promise<string> {
        const key = `${folderPath}${fileName}`;
        const data = MockS3Gateway.mockStorage.get(key);
        if (!data) {
            console.warn(`モックのファイルが存在しません: ${key}`);
            return '';
        }
        console.log(`モックのファイルを取得しました: ${key}`);
        return data;
    }

    /**
     * オブジェクトデータをCSV形式に変換する
     * @private
     * @param {T[]} data
     * @returns {string}
     */
    @Logger
    private convertToCsv(data: object[]): string {
        if (data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const csvHeader = keys.join(',') + '\n';
        const csvRows = data
            .map((item) => keys.map((key) => (item as any)[key]).join(','))
            .join('\n');

        return `${csvHeader}${csvRows}`;
    }

    /**
     * 日付を start(inclusive) から end(exclusive) まで1日ずつループする
     */
    private iterateDates(start: Date, end: Date, fn: (d: Date) => void) {
        const current = new Date(start);
        while (current.getTime() < end.getTime()) {
            fn(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    }

    private async loadCsvFiles(csvPathList: string[]) {
        for (const csvPathItem of csvPathList) {
            try {
                const _csvPath = path.join(this.mockCsvBaseDir, csvPathItem);
                const data = await fs.readFile(_csvPath, 'utf8');
                MockS3Gateway.mockStorage.set(csvPathItem, data);
                console.log(
                    `MockS3Gateway: ${csvPathItem}のデータを読み込みました`,
                );
            } catch (error) {
                console.error(`Error reading CSV from ${csvPathItem}:`, error);
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setPlaceMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                // 最初にmockStorageに値を入れておく
                // 2024年のデータ366日分を作成
                await Promise.all(
                    RACE_TYPE_LIST_WITHOUT_OVERSEAS_FOR_AWS.map((raceType) =>
                        this.setRaceTypePlaceMockData(raceType),
                    ),
                );
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = RACE_TYPE_LIST_WITHOUT_OVERSEAS_FOR_AWS.map(
                    (raceType) => csvPath('PLACE_LIST', raceType),
                );
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setRaceMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                // 最初にmockStorageに値を入れておく
                // 2024年のデータ366日分を作成
                await Promise.all([
                    ...RACE_TYPE_LIST_HORSE_RACING_FOR_AWS.map((raceType) =>
                        this.setHorseRacingRaceMockData(raceType),
                    ),
                    ...RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS.map(
                        (raceType) =>
                            this.setMechanicalRacingRaceMockData(raceType),
                    ),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = RACE_TYPE_LIST_ALL_FOR_AWS.map((raceType) =>
                    csvPath('RACE_LIST', raceType),
                );
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setRacePlayerMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return;
            }
            case allowedEnvs.local: {
                const csvPathList =
                    RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS.map((raceType) =>
                        csvPath('RACE_PLAYER_LIST', raceType),
                    );
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setPlayerMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [csvPath('PLAYER_LIST', 'data')];
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    @Logger
    private async setHorseRacingRaceMockData(raceType: RaceType) {
        // 2024年のデータ366日分を作成
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.NAME,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.SURFACE_TYPE,
            CSV_HEADER_KEYS.DISTANCE,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.NUMBER,
        ].join(',');
        const mockData = [mockDataHeader];
        this.iterateDates(this.startDate, this.finishDate, (currentDate) => {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        generateId(IdType.RACE, {
                            raceType: raceType,
                            dateTime: currentDate,
                            location: defaultLocation[raceType],
                            number: raceNumber,
                        }),
                        defaultRaceName[raceType],
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        defaultLocation[raceType],
                        defaultRaceSurfaceType[raceType],
                        defaultRaceDistance[raceType],
                        defaultRaceGrade[raceType],
                        raceNumber,
                    ].join(','),
                );
            }
        });

        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setMechanicalRacingRaceMockData(raceType: RaceType) {
        // 2024年のデータ366日分を作成
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.NAME,
            CSV_HEADER_KEYS.STAGE,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.NUMBER,
        ].join(',');
        const mockData = [mockDataHeader];
        this.iterateDates(this.startDate, this.finishDate, (currentDate) => {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        generateId(IdType.RACE, {
                            raceType: raceType,
                            dateTime: currentDate,
                            location: defaultLocation[raceType],
                            number: raceNumber,
                        }),
                        defaultRaceName[raceType],
                        defaultStage[raceType],
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        defaultLocation[raceType],
                        defaultRaceGrade[raceType],
                        raceNumber,
                    ].join(','),
                );
            }
        });

        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setRaceTypePlaceMockData(raceType: RaceType) {
        const fileName = csvPath('PLACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.UPDATE_DATE,
        ].join(',');
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                const nextMonth = new Date(year, month, 1);
                // iterate days in the month
                this.iterateDates(startDate, nextMonth, (currentDate) => {
                    mockData.push(
                        [
                            generateId(IdType.PLACE, {
                                raceType: raceType,
                                dateTime: currentDate,
                                location: defaultLocation[raceType],
                            }),
                            format(currentDate, 'yyyy-MM-dd'),
                            defaultLocation[raceType],
                            getJSTDate(new Date()),
                        ].join(','),
                    );
                });
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setHeldDayMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                // 最初にmockStorageに値を入れておく
                // 2024年のデータ366日分を作成
                await Promise.all([this.setJraHeldDayMockData()]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [csvPath('HELD_DAY_LIST', RaceType.JRA)];
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setPlaceGradeMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                // 最初にmockStorageに値を入れておく
                // 2024年のデータ366日分を作成
                await Promise.all(
                    RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS.map((raceType) =>
                        this.setRaceTypePlaceGradeMockData(raceType),
                    ),
                );

                return;
            }
            case allowedEnvs.local: {
                const csvPathList =
                    RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS.map((raceType) =>
                        csvPath('GRADE_LIST', raceType),
                    );
                await this.loadCsvFiles(csvPathList);
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    @Logger
    private async setJraHeldDayMockData() {
        const raceType: RaceType = RaceType.JRA;

        const fileName = csvPath('PLACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.RACE_TYPE,
            CSV_HEADER_KEYS.HELD_TIMES,
            CSV_HEADER_KEYS.HELD_DAY_TIMES,
        ].join(',');
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                const nextMonth = new Date(year, month, 1);
                this.iterateDates(startDate, nextMonth, (currentDate) => {
                    mockData.push(
                        [
                            generateId(IdType.PLACE, {
                                raceType: raceType,
                                dateTime: currentDate,
                                location: defaultLocation[raceType],
                            }),
                            raceType,
                            '1',
                            '1',
                        ].join(','),
                    );
                });
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setRaceTypePlaceGradeMockData(raceType: RaceType) {
        const fileName = csvPath('GRADE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.RACE_TYPE,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.UPDATE_DATE,
        ].join(',');
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                const nextMonth = new Date(year, month, 1);
                this.iterateDates(startDate, nextMonth, (currentDate) => {
                    mockData.push(
                        [
                            generateId(IdType.PLACE, {
                                raceType: raceType,
                                dateTime: currentDate,
                                location: defaultLocation[raceType],
                            }),
                            raceType,
                            defaultPlaceGrade[raceType],
                            getJSTDate(new Date()),
                        ].join(','),
                    );
                });
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }
}
