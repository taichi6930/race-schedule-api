
import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';
import { injectable } from 'tsyringe';

import { CSV_HEADER_KEYS, csvPath } from '../../utility/constants';
import { GradeType } from '../../utility/data/common/gradeType';
import { generatePlaceId } from '../../utility/data/common/placeId';
import { generateRaceId } from '../../utility/data/common/raceId';
import { RaceStage } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { allowedEnvs, ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IS3Gateway } from '../interface/iS3Gateway';


@injectable()
export class MockS3Gateway implements IS3Gateway {
    
    private static mockStorage: Map<string, string> = new Map<string, string>();

    
    private static isInitialized = false;

    
    private readonly bucketName: string;

    
    private startDate = new Date('2001-01-01');
    
    private finishDate = new Date('2030-01-01');

    
    public constructor(bucketName: string) {
        this.bucketName = bucketName;
        (async () => {
            
            if (MockS3Gateway.isInitialized) {
                return;
            }
            
            MockS3Gateway.isInitialized = true;

            await this.setPlaceMockData();
            await this.setRaceMockData();
            await this.setRacePlayerMockData();
            await this.setHeldDayMockData();
            await this.setPlaceGradeMockData();
        })();
    }

    
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

    
    @Logger
    private async setPlaceMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                
                
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

    
    @Logger
    private async setRaceMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                
                
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
        
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.NAME,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.SURFACE_TYPE,
            CSV_HEADER_KEYS.DISTANCE,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.NUMBER,
            CSV_HEADER_KEYS.ID,
        ].join(',');
        const mockData = [mockDataHeader];
        const currentDate = new Date(this.startDate);
        
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        this.createRaceName(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.defaultLocation[raceType],
                        'ダート',
                        '2000',
                        this.createGrade(raceType),
                        raceNumber,
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.defaultLocation[raceType],
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
        
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.NAME,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.SURFACE_TYPE,
            CSV_HEADER_KEYS.DISTANCE,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.NUMBER,
            CSV_HEADER_KEYS.HELD_TIMES,
            CSV_HEADER_KEYS.HELD_DAY_TIMES,
            CSV_HEADER_KEYS.ID,
        ].join(',');
        const mockData = [mockDataHeader];

        const currentDate = new Date(this.startDate);
        
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        this.createRaceName(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.defaultLocation[raceType],
                        '芝',
                        '2400',
                        this.createGrade(raceType),
                        raceNumber,
                        '1',
                        '1',
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.defaultLocation[raceType],
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
        
        const currentDate = new Date(this.startDate);
        const fileName = csvPath('RACE_LIST', raceType as RaceType);
        const mockDataHeader = [
            CSV_HEADER_KEYS.NAME,
            CSV_HEADER_KEYS.STAGE,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.NUMBER,
            CSV_HEADER_KEYS.ID,
        ].join(',');
        const mockData = [mockDataHeader];
        
        while (currentDate.getFullYear() !== this.finishDate.getFullYear()) {
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                mockData.push(
                    [
                        this.createRaceName(raceType),
                        this.createStage(raceType),
                        `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                        this.defaultLocation[raceType],
                        this.createGrade(raceType),
                        raceNumber,
                        generateRaceId(
                            raceType,
                            currentDate,
                            this.defaultLocation[raceType],
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
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.DATE_TIME,
            CSV_HEADER_KEYS.LOCATION,
            CSV_HEADER_KEYS.UPDATE_DATE,
        ].join(',');
        const mockData = [mockDataHeader];
        
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                
                
                const currentDate = new Date(this.startDate);
                
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                raceType,
                                currentDate,
                                this.defaultLocation[raceType],
                            ),
                            format(currentDate, 'yyyy-MM-dd'),
                            this.defaultLocation[raceType],
                            getJSTDate(new Date()),
                        ].join(','),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        MockS3Gateway.mockStorage.set(fileName, mockData.join('\n'));
    }

    
    @Logger
    private async setHeldDayMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                
                
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

    
    @Logger
    private async setPlaceGradeMockData() {
        switch (ENV) {
            case allowedEnvs.localNoInitData: {
                return;
            }
            case allowedEnvs.localInitMadeData: {
                
                
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
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.RACE_TYPE,
            CSV_HEADER_KEYS.HELD_TIMES,
            CSV_HEADER_KEYS.HELD_DAY_TIMES,
        ].join(',');
        const mockData = [mockDataHeader];
        
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                
                
                const currentDate = new Date(this.startDate);
                
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                raceType,
                                currentDate,
                                this.defaultLocation[raceType],
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
        const mockDataHeader = [
            CSV_HEADER_KEYS.ID,
            CSV_HEADER_KEYS.RACE_TYPE,
            CSV_HEADER_KEYS.GRADE,
            CSV_HEADER_KEYS.UPDATE_DATE,
        ].join(',');
        const mockData = [mockDataHeader];
        
        for (
            let year = 2001;
            year <= this.finishDate.getFullYear() - 1;
            year++
        ) {
            
            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(year, month - 1, 1);
                
                
                const currentDate = new Date(this.startDate);
                
                while (currentDate.getMonth() === startDate.getMonth()) {
                    mockData.push(
                        [
                            generatePlaceId(
                                raceType,
                                currentDate,
                                this.defaultLocation[raceType],
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

    private readonly defaultLocation = {
        [RaceType.JRA]: '東京',
        [RaceType.NAR]: '大井',
        [RaceType.OVERSEAS]: 'パリロンシャン',
        [RaceType.KEIRIN]: '平塚',
        [RaceType.AUTORACE]: '川口',
        [RaceType.BOATRACE]: '浜名湖',
    };

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
