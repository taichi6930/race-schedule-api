/* eslint-disable */
import { injectable } from 'tsyringe';
import { IS3Gateway, Record } from '../interface/iS3Gateway';
import { format } from 'date-fns';
import { Logger } from '../../utility/logger';
import { ENV } from '../../utility/env';
import fs from 'fs';
import path from 'path';
import {
    generateAutoracePlaceId,
    generateAutoraceRaceId,
    generateBoatracePlaceId,
    generateBoatraceRaceId,
    generateJraPlaceId,
    generateJraRaceId,
    generateKeirinPlaceId,
    generateKeirinRaceId,
    generateNarPlaceId,
    generateNarRaceId,
    generateWorldRaceId,
} from '../../utility/raceId';

/**
 * MockS3Gateway
 */
@injectable()
export class MockS3Gateway<T extends object> implements IS3Gateway<Record> {
    /**
     * モックデータを保存するためのマップ
     *
     * @private
     * @type {Map<string, string>}
     */
    private static mockStorage: Map<string, string> = new Map<string, string>();

    /**
     * 初期化処理フラグ
     * @private
     * @static
     * @type {boolean}
     */
    private static isInitialized = false;

    /**
     * バケット名 S3の中にあるデータの保存場所
     *
     * @private
     * @type {string}
     */
    private bucketName: string;
    /**
     * フォルダのパス
     *
     * @private
     * @type {string}
     */
    private folderPath: string;

    // スタートの年数
    private startDate = new Date('2001-01-01');
    // 終了の年数
    private finishDate = new Date('2025-01-01');

    /**
     * MockS3Gatewayのコンストラクタ
     * @param {string} bucketName
     * @param {string} folderPath
     */
    constructor(bucketName: string, folderPath: string) {
        (async () => {
            this.bucketName = bucketName;
            this.folderPath = folderPath;

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
     * モックデータを作成する
     */
    @Logger
    private async setPlaceMockData() {
        if (ENV === 'ITa') return;
        if (ENV === 'STAGING') {
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
                const data = fs.readFileSync(_csvPath, 'utf-8');
                MockS3Gateway.mockStorage.set(csvPath, data);
                console.log(
                    `MockS3Gateway: ${csvPath}のデータを読み込みました`,
                );
            } catch (error) {
                console.error(`Error reading CSV from ${csvPath}:`, error);
            }
        }
    }

    /**
     * モックデータを作成する
     */
    @Logger
    private async setRaceMockData() {
        if (ENV === 'ITa') return;
        if (ENV === 'STAGING') {
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
                const data = fs.readFileSync(_csvPath, 'utf-8');
                MockS3Gateway.mockStorage.set(csvPath, data);
            } catch (error) {
                console.error(`Error reading CSV from ${csvPath}:`, error);
            }
        }
    }

    /**
     * WorldRaceのモックデータを作成する
     */
    @Logger
    private async setWorldRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
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
                                generateWorldRaceId(
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
                break;
        }
    }

    @Logger
    private async setNarRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
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
                                generateNarRaceId(
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
                break;
        }
    }

    @Logger
    private async setOldNarRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                // 2024年のデータ366日分を作成

                const currentDate = new Date(this.startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
                    const fileName = `nar/race/${format(currentDate, 'yyyyMMdd')}.csv`;
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
                    for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                        mockData.push(
                            [
                                `川崎記念`,
                                `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                                '川崎',
                                'ダート',
                                '2100',
                                'JpnⅠ',
                                raceNumber,
                                generateNarRaceId(
                                    currentDate,
                                    '川崎',
                                    raceNumber,
                                ),
                            ].join(','),
                        );
                    }
                    MockS3Gateway.mockStorage.set(
                        fileName,
                        mockData.join('\n'),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                break;
        }
    }

    @Logger
    private async setNarPlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                        while (
                            currentDate.getMonth() === startDate.getMonth()
                        ) {
                            mockData.push(
                                [
                                    generateNarPlaceId(currentDate, '大井'),
                                    format(currentDate, 'yyyy-MM-dd'),
                                    '大井',
                                ].join(','),
                            );
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    }
                }
                MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
                break;
        }
    }

    @Logger
    private async setJraRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
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
                                generateJraRaceId(
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
                break;
        }
    }

    @Logger
    private async setJraPlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                        while (
                            currentDate.getMonth() === startDate.getMonth()
                        ) {
                            mockData.push(
                                [
                                    generateJraPlaceId(currentDate, '東京'),
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
                break;
        }
    }

    @Logger
    private async setKeirinRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
                    for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                        mockData.push(
                            [
                                `KEIRINグランプリ`,
                                `グランプリ`,
                                `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                                '川崎',
                                'GP',
                                raceNumber,
                                generateKeirinRaceId(
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
                break;
        }
    }

    @Logger
    private async setKeirinPlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                const fileName = `keirin/placeList.csv`;
                const mockDataHeader = [
                    'id',
                    'dateTime',
                    'location',
                    'grade',
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
                        while (
                            currentDate.getMonth() === startDate.getMonth()
                        ) {
                            mockData.push(
                                [
                                    generateKeirinPlaceId(currentDate, '川崎'),
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
                break;
        }
    }

    @Logger
    private async setAutoraceRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
                    for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                        mockData.push(
                            [
                                `スーパースター王座決定戦`,
                                `優勝戦`,
                                `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                                '飯塚',
                                'SG',
                                raceNumber,
                                generateAutoraceRaceId(
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
                break;
        }
    }

    @Logger
    private async setAutoracePlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                const fileName = `autorace/placeList.csv`;
                const mockDataHeader = [
                    'id',
                    'dateTime',
                    'location',
                    'grade',
                ].join(',');
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
                        while (
                            currentDate.getMonth() === startDate.getMonth()
                        ) {
                            mockData.push(
                                [
                                    generateAutoracePlaceId(
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
                break;
        }
    }

    @Logger
    private async setBoatraceRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
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
                while (
                    currentDate.getFullYear() !== this.finishDate.getFullYear()
                ) {
                    for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                        mockData.push(
                            [
                                `グランプリ`,
                                `優勝戦`,
                                `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                                '平和島',
                                'SG',
                                raceNumber,
                                generateBoatraceRaceId(
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
                break;
        }
    }

    @Logger
    private async setBoatracePlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                const fileName = `boatrace/placeList.csv`;
                const mockDataHeader = [
                    'id',
                    'dateTime',
                    'location',
                    'grade',
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
                        while (
                            currentDate.getMonth() === startDate.getMonth()
                        ) {
                            mockData.push(
                                [
                                    generateBoatracePlaceId(
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
                break;
        }
    }

    /**
     * モックのデータをS3にアップロードする
     *
     * @param data
     * @param fileName
     */
    @Logger
    async uploadDataToS3(data: Record[], fileName: string): Promise<void> {
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
     *
     * @param fileName
     * @returns
     */
    @Logger
    async fetchDataFromS3(fileName: string): Promise<string> {
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
     *
     * @private
     * @param {T[]} data
     * @returns {string}
     */
    @Logger
    private convertToCsv(data: Record[]): string {
        if (data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const csvHeader = keys.join(',') + '\n';
        const csvRows = data
            .map((item) => keys.map((key) => (item as any)[key]).join(','))
            .join('\n');

        return `${csvHeader}${csvRows}`;
    }
}
