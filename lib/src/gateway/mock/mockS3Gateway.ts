/* eslint-disable */
import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';
import { injectable } from 'tsyringe';

import { allowedEnvs, ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { generatePlaceId, generateRaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { IS3Gateway } from '../interface/iS3Gateway';
import { IRecord } from '../record/iRecord';

/**
 * MockS3Gateway
 */
@injectable()
export class MockS3Gateway<T extends IRecord<T>> implements IS3Gateway<T> {
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
     * フォルダのパス
     * @private
     * @type {string}
     */
    private folderPath: string = '';

    // スタートの年数
    private startDate = new Date('2001-01-01');
    // 終了の年数
    private finishDate = new Date('2030-01-01');

    /**
     * MockS3Gatewayのコンストラクタ
     * @param {string} folderPath
     */
    public constructor(_: string, folderPath: string) {
        this.folderPath = folderPath;
        (async () => {
            // 既にmockStorageに値が入っている場合は何もしない
            if (MockS3Gateway.isInitialized) {
                return;
            }
            // 初期化処理フラグを立てる
            MockS3Gateway.isInitialized = true;

            await this.setPlaceMockData();
            await this.setRaceMockData();
        })();
    }

    /**
     * モックのデータをS3にアップロードする
     * @param data
     * @param fileName
     */
    @Logger
    public async uploadDataToS3(
        data: IRecord<T>[],
        fileName: string,
    ): Promise<void> {
        try {
            const csvContent = this.convertToCsv(data);
            const key = `${this.folderPath}${fileName}`;
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
    public async fetchDataFromS3(fileName: string): Promise<string> {
        const key = `${this.folderPath}${fileName}`;
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
    private convertToCsv(data: IRecord<T>[]): string {
        if (data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const csvHeader = keys.join(',') + '\n';
        const csvRows = data
            .map((item) => keys.map((key) => (item as any)[key]).join(','))
            .join('\n');

        return `${csvHeader}${csvRows}`;
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
                await Promise.all([
                    this.setNarPlaceMockData(),
                    this.setJraPlaceMockData(),
                    this.setKeirinPlaceMockData(),
                    this.setAutoracePlaceMockData(),
                    this.setBoatracePlaceMockData(),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    'nar/placeList.csv', // nar
                    'jra/placeList.csv', // jra
                    'keirin/placeList.csv', // keirin
                    'autorace/placeList.csv', // autorace
                    'boatrace/placeList.csv', // boatrace
                ];

                for (const csvPath of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPath}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPath, data);
                        console.log(
                            `MockS3Gateway: ${csvPath}のデータを読み込みました`,
                        );
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPath}:`,
                            error,
                        );
                    }
                }
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
                    this.setNarRaceMockData(),
                    this.setJraRaceMockData(),
                    this.setKeirinRaceMockData(),
                    this.setAutoraceRaceMockData(),
                    this.setBoatraceRaceMockData(),
                    this.setWorldRaceMockData(),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    'world/raceList.csv', // world
                    'nar/raceList.csv', // nar
                    'jra/raceList.csv', // jra
                    'keirin/raceList.csv', // keirin
                    'autorace/raceList.csv', // autorace
                    'boatrace/raceList.csv', // boatrace
                ];

                for (const csvPath of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPath}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPath, data);
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPath}:`,
                            error,
                        );
                    }
                }
                return;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * WorldRaceのモックデータを作成する
     */
    @Logger
    private async setWorldRaceMockData() {
        // 2024年のデータ366日分を作成
        const currentDate = new Date(this.startDate);
        const fileName = `world/raceList.csv`;
        const mockDataHeader = [
            'name',
            'dateTime',
            'location',
            'surfaceType',
            'distance',
            'grade',
            'number',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `凱旋門賞`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        'パリロンシャン',
                        '芝',
                        '2400',
                        'GⅠ',
                        raceNumber,
                        generateRaceId(
                            RaceType.WORLD,
                            currentDate,
                            'パリロンシャン',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setNarRaceMockData() {
        // 2024年のデータ366日分を作成
        const fileName = `nar/raceList.csv`;
        const mockDataHeader = [
            'name',
            'dateTime',
            'location',
            'surfaceType',
            'distance',
            'grade',
            'number',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];
        const currentDate = new Date(this.startDate);
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `東京大賞典`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        '大井',
                        'ダート',
                        '2000',
                        'GⅠ',
                        raceNumber,
                        generateRaceId(
                            RaceType.NAR,
                            currentDate,
                            '大井',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setNarPlaceMockData() {
        const fileName = `nar/placeList.csv`;
        const mockDataHeader = ['id', 'dateTime', 'location'].join(',');
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            // 2024年のデータ12ヶ月分を作成
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                // 1ヶ月分のデータ（28~31日）を作成
                // 2024年のデータ366日分を作成
                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(RaceType.NAR, currentDate, '大井'),
                            format(currentDate, 'yyyy-MM-dd'),
                            '大井',
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setJraRaceMockData() {
        // 2024年のデータ366日分を作成
        const fileName = `jra/raceList.csv`;
        const mockDataHeader = [
            'name',
            'dateTime',
            'location',
            'surfaceType',
            'distance',
            'grade',
            'number',
            'heldTimes',
            'heldDayTimes',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];

        const currentDate = new Date(this.startDate);
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `日本ダービー`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        '東京',
                        '芝',
                        '2400',
                        'GⅠ',
                        raceNumber,
                        '1',
                        '1',
                        generateRaceId(
                            RaceType.JRA,
                            currentDate,
                            '東京',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setJraPlaceMockData() {
        const fileName = `jra/placeList.csv`;
        const mockDataHeader = [
            'id',
            'dateTime',
            'location',
            'heldTimes',
            'heldDayTimes',
        ].join(',');
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            // 2024年のデータ12ヶ月分を作成
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                // 1ヶ月分のデータ（28~31日）を作成
                // 2024年のデータ366日分を作成
                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(RaceType.JRA, currentDate, '東京'),
                            format(currentDate, 'yyyy-MM-dd'),
                            '東京',
                            '1',
                            '1',
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setKeirinRaceMockData() {
        // 2024年のデータ366日分を作成
        const fileName = `keirin/raceList.csv`;
        const mockDataHeader = [
            'name',
            'stage',
            'dateTime',
            'location',
            'grade',
            'number',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];

        const currentDate = new Date(this.startDate);
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `KEIRINグランプリ`,
                        `グランプリ`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        '川崎',
                        'GP',
                        raceNumber,
                        generateRaceId(
                            RaceType.KEIRIN,
                            currentDate,
                            '川崎',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setKeirinPlaceMockData() {
        const fileName = `keirin/placeList.csv`;
        const mockDataHeader = ['id', 'dateTime', 'location', 'grade'].join(
            ',',
        );
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            // 2024年のデータ12ヶ月分を作成
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                // 1ヶ月分のデータ（28~31日）を作成
                // 2024年のデータ366日分を作成
                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                RaceType.KEIRIN,
                                currentDate,
                                '川崎',
                            ),
                            format(currentDate, 'yyyy-MM-dd'),
                            '川崎',
                            'GP',
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setAutoraceRaceMockData() {
        // 2024年のデータ366日分を作成

        const currentDate = new Date(this.startDate);
        const fileName = `autorace/raceList.csv`;
        const mockDataHeader = [
            'name',
            'stage',
            'dateTime',
            'location',
            'grade',
            'number',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `スーパースター王座決定戦`,
                        `優勝戦`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        '飯塚',
                        'SG',
                        raceNumber,
                        generateRaceId(
                            RaceType.AUTORACE,
                            currentDate,
                            '飯塚',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setAutoracePlaceMockData() {
        const fileName = `autorace/placeList.csv`;
        const mockDataHeader = ['id', 'dateTime', 'location', 'grade'].join(
            ',',
        );
        const mockData = [mockDataHeader];
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            // 2024年のデータ12ヶ月分を作成
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                // 1ヶ月分のデータ（28~31日）を作成
                // 2024年のデータ366日分を作成
                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                RaceType.AUTORACE,
                                currentDate,
                                '飯塚',
                            ),
                            format(currentDate, 'yyyy-MM-dd'),
                            '飯塚',
                            'SG',
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setBoatraceRaceMockData() {
        // 2024年のデータ366日分を作成

        const currentDate = new Date(this.startDate);
        const fileName = `boatrace/raceList.csv`;
        const mockDataHeader = [
            'name',
            'stage',
            'dateTime',
            'location',
            'grade',
            'number',
            'id',
        ].join(',');
        const mockData = [mockDataHeader];
        // whileで回していって、最初の日付の年数と異なったら終了
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        `グランプリ`,
                        `優勝戦`,
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        '平和島',
                        'SG',
                        raceNumber,
                        generateRaceId(
                            RaceType.BOATRACE,
                            currentDate,
                            '平和島',
                            raceNumber,
                        ),
                    ].join(','),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    @Logger
    private async setBoatracePlaceMockData() {
        const fileName = `boatrace/placeList.csv`;
        const mockDataHeader = ['id', 'dateTime', 'location', 'grade'].join(
            ',',
        );
        const mockData = [mockDataHeader];
        // 2024年のデータ12ヶ月分を作成
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            // 2024年のデータ12ヶ月分を作成
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                // 1ヶ月分のデータ（28~31日）を作成
                // 2024年のデータ366日分を作成
                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                RaceType.BOATRACE,
                                currentDate,
                                '平和島',
                            ),
                            format(currentDate, 'yyyy-MM-dd'),
                            '平和島',
                            'SG',
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }
}
