/* eslint-disable */
import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';
import { injectable } from 'tsyringe';

import { csvPath } from '../../utility/constants';
import { GradeType } from '../../utility/data/common/gradeType';
import { generatePlaceId } from '../../utility/data/common/placeId';
import { generateRaceId } from '../../utility/data/common/raceId';
import { RaceStage } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { allowedEnvs, ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
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
     * バケット名 S3の中にあるデータの保存場所
     * @type {string}
     * @private
     */
    private readonly bucketName: string;

    // スタートの年数
    private startDate = new Date('2001-01-01');
    // 終了の年数
    private finishDate = new Date('2030-01-01');

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
                    this.setRaceTypePlaceMockData(RaceType.JRA),
                    this.setRaceTypePlaceMockData(RaceType.NAR),
                    this.setRaceTypePlaceMockData(RaceType.KEIRIN),
                    this.setRaceTypePlaceMockData(RaceType.AUTORACE),
                    this.setRaceTypePlaceMockData(RaceType.BOATRACE),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    csvPath('PLACE_LIST', RaceType.NAR),
                    csvPath('PLACE_LIST', RaceType.JRA),
                    csvPath('PLACE_LIST', RaceType.KEIRIN),
                    csvPath('PLACE_LIST', RaceType.AUTORACE),
                    csvPath('PLACE_LIST', RaceType.BOATRACE),
                ];

                for (const csvPathItem of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPathItem}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPathItem, data);
                        console.log(
                            `MockS3Gateway: ${csvPathItem}のデータを読み込みました`,
                        );
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPathItem}:`,
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
                    this.setJraRaceMockData(),
                    this.setHorseRacingRaceMockData(RaceType.NAR),
                    this.setHorseRacingRaceMockData(RaceType.OVERSEAS),
                    this.setMechanicalRacingRaceMockData(RaceType.KEIRIN),
                    this.setMechanicalRacingRaceMockData(RaceType.AUTORACE),
                    this.setMechanicalRacingRaceMockData(RaceType.BOATRACE),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    csvPath('RACE_LIST', RaceType.OVERSEAS),
                    csvPath('RACE_LIST', RaceType.NAR),
                    csvPath('RACE_LIST', RaceType.JRA),
                    csvPath('RACE_LIST', RaceType.KEIRIN),
                    csvPath('RACE_LIST', RaceType.AUTORACE),
                    csvPath('RACE_LIST', RaceType.BOATRACE),
                ];

                for (const csvPathItem of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPathItem}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPathItem, data);
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPathItem}:`,
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
    private async setRacePlayerMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    csvPath('RACE_PLAYER_LIST', RaceType.KEIRIN),
                    csvPath('RACE_PLAYER_LIST', RaceType.AUTORACE),
                    csvPath('RACE_PLAYER_LIST', RaceType.BOATRACE),
                ];

                for (const csvPathItem of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPathItem}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPathItem, data);
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPathItem}:`,
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

    @Logger
    private async setHorseRacingRaceMockData(raceType: RaceType) {
        // 2024年のデータ366日分を作成
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
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
                        this.createRaceName(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.createLocation(raceType),
                        'ダート',
                        '2000',
                        this.createGrade(raceType),
                        raceNumber,
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.createLocation(raceType),
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
    private async setJraRaceMockData() {
        const raceType: RaceType = RaceType.JRA;
        // 2024年のデータ366日分を作成
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
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
                        this.createRaceName(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.createLocation(raceType),
                        '芝',
                        '2400',
                        this.createGrade(raceType),
                        raceNumber,
                        '1',
                        '1',
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.createLocation(raceType),
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
    private async setMechanicalRacingRaceMockData(raceType: RaceType) {
        // 2024年のデータ366日分を作成
        const currentDate = new Date(this.startDate);
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
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
                        this.createRaceName(raceType),
                        this.createStage(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.createLocation(raceType),
                        this.createGrade(raceType),
                        raceNumber,
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.createLocation(raceType),
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
    private async setRaceTypePlaceMockData(raceType: RaceType) {
        const fileName = csvPath('PLACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            'id',
            'dateTime',
            'location',
            'updateDate',
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
                            generatePlaceId(
                                raceType,
                                currentDate,
                                this.createLocation(raceType),
                            ),
                            format(currentDate, 'yyyy-MM-dd'),
                            this.createLocation(raceType),
                            getJSTDate(new Date()),
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
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

                for (const csvPathItem of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPathItem}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPathItem, data);
                        console.log(
                            `MockS3Gateway: ${csvPathItem}のデータを読み込みました`,
                        );
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPathItem}:`,
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
    private async setPlaceGradeMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                // 最初にmockStorageに値を入れておく
                // 2024年のデータ366日分を作成
                await Promise.all([
                    this.setRaceTypePlaceGradeMockData(RaceType.KEIRIN),
                    this.setRaceTypePlaceGradeMockData(RaceType.AUTORACE),
                    this.setRaceTypePlaceGradeMockData(RaceType.BOATRACE),
                ]);
                return;
            }
            case allowedEnvs.local: {
                const csvPathList = [
                    csvPath('GRADE_LIST', RaceType.KEIRIN),
                    csvPath('GRADE_LIST', RaceType.AUTORACE),
                    csvPath('GRADE_LIST', RaceType.BOATRACE),
                ];

                for (const csvPathItem of csvPathList) {
                    try {
                        const _csvPath = path.join(
                            __dirname,
                            `../mockData/csv/${csvPathItem}`,
                        );
                        const data = await fs.readFile(_csvPath, 'utf8');
                        MockS3Gateway.mockStorage.set(csvPathItem, data);
                        console.log(
                            `MockS3Gateway: ${csvPathItem}のデータを読み込みました`,
                        );
                    } catch (error) {
                        console.error(
                            `Error reading CSV from ${csvPathItem}:`,
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

    @Logger
    private async setJraHeldDayMockData() {
        const raceType: RaceType = RaceType.JRA;

        const fileName = csvPath('PLACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            'id',
            'raceType',
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
                            generatePlaceId(
                                raceType,
                                currentDate,
                                this.createLocation(raceType),
                            ),
                            raceType,
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
    private async setRaceTypePlaceGradeMockData(raceType: RaceType) {
        const fileName = csvPath('GRADE_LIST', raceType as RaceType);
        const mockDataHeader = ['id', 'raceType', 'grade', 'UpdateDate'].join(
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
                                raceType,
                                currentDate,
                                this.createLocation(raceType),
                            ),
                            raceType,
                            this.createGrade(raceType),
                            getJSTDate(new Date()),
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    private createLocation(raceType: RaceType): string {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return '川崎';
            }
            case RaceType.BOATRACE: {
                return '平和島';
            }
            case RaceType.AUTORACE: {
                return '飯塚';
            }
            case RaceType.JRA: {
                return '東京';
            }
            case RaceType.NAR: {
                return '大井';
            }
            case RaceType.OVERSEAS: {
                return 'サンタアニタパーク';
            }
        }
    }

    private createGrade(raceType: RaceType): GradeType {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return 'GP';
            }
            case RaceType.BOATRACE:
            case RaceType.AUTORACE: {
                return 'SG';
            }
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return 'GⅠ';
            }
        }
    }

    private createStage(raceType: RaceType): RaceStage {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return 'S級グランプリ';
            }
            case RaceType.BOATRACE:
            case RaceType.AUTORACE: {
                return '優勝戦';
            }
            case RaceType.JRA: {
                return '不明';
            }
            case RaceType.NAR: {
                return '不明';
            }
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }

    private createRaceName(raceType: RaceType): RaceStage {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return 'KEIRINグランプリ';
            }
            case RaceType.BOATRACE: {
                return 'グランプリ';
            }
            case RaceType.AUTORACE: {
                return 'スーパースター王座決定戦';
            }
            case RaceType.JRA: {
                return '日本ダービー';
            }
            case RaceType.NAR: {
                return '東京大賞典';
            }
            case RaceType.OVERSEAS: {
                return 'BCクラシック';
            }
        }
    }
}
