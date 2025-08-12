import '../../utility/format';

import fs from 'node:fs';
import path from 'node:path';

import type { RaceCourse } from '../../utility/data/common/raceCourse';
import {
    generatePlaceId,
    generateRaceId,
    generateRacePlayerId,
} from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceRecord } from '../record/mechanicalRacingPlaceRecord';
import { MechanicalRacingRaceRecord } from '../record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../record/racePlayerRecord';

// 出力先CSVファイルパス
const outputPath = (raceType: RaceType, listType: string): string =>
    path.join(
        __dirname,
        `../mockData/csv/${raceType.toLowerCase()}/${listType}.csv`,
    );

const createPlace = (raceType: RaceType): RaceCourse => {
    switch (raceType) {
        case RaceType.AUTORACE: {
            return '飯塚';
        }
        case RaceType.KEIRIN: {
            return '立川';
        }
        case RaceType.BOATRACE: {
            return '常滑';
        }
        case RaceType.JRA: {
            return '東京';
        }
        case RaceType.NAR: {
            return '大井';
        }
        case RaceType.WORLD: {
            return 'ロンシャン';
        }
        default: {
            throw new Error(`Unsupported race type`);
        }
    }
};

const createGrade = (raceType: RaceType): string => {
    switch (raceType) {
        case RaceType.AUTORACE: {
            return 'SG';
        }
        case RaceType.KEIRIN: {
            return 'GP';
        }
        case RaceType.BOATRACE: {
            return 'SG';
        }
        case RaceType.JRA: {
            return 'GⅠ';
        }
        case RaceType.NAR: {
            return 'GⅠ';
        }
        case RaceType.WORLD: {
            return 'GⅠ';
        }
        default: {
            throw new Error(`Unsupported race type`);
        }
    }
};

const createStage = (raceType: RaceType): string => {
    switch (raceType) {
        case RaceType.AUTORACE:
        case RaceType.BOATRACE: {
            return '優勝戦';
        }
        case RaceType.KEIRIN: {
            return 'S級決勝';
        }
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            throw new Error(`Stage is not supported for ${raceType}`);
        }
        default: {
            throw new Error(`Unsupported stage`);
        }
    }
};

const createPlayerNumber = (raceType: RaceType): number => {
    switch (raceType) {
        case RaceType.AUTORACE: {
            return 8;
        }
        case RaceType.BOATRACE: {
            return 6;
        }
        case RaceType.KEIRIN: {
            return 9;
        }
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            throw new Error(`PlayerNumber is not supported for ${raceType}`);
        }
        default: {
            throw new Error(`Unsupported stage`);
        }
    }
};

function generateMechanicalRacingData(raceType: RaceType): {
    placeRecord: MechanicalRacingPlaceRecord[];
    raceRecord: MechanicalRacingRaceRecord[];
    racePlayerRecord: RacePlayerRecord[];
} {
    // 2022年から2026年までのIDを生成
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2026-01-01');

    const placeRecordList: MechanicalRacingPlaceRecord[] = [];
    const raceRecordList: MechanicalRacingRaceRecord[] = [];
    const racePlayerList: RacePlayerRecord[] = [];

    // 1日ずつ増やしていく
    for (
        let currentDate = new Date(endDate);
        currentDate > startDate;
        currentDate.setDate(currentDate.getDate() - 1)
    ) {
        // レースIDを生成
        const placeId = generatePlaceId(
            raceType,
            currentDate,
            createPlace(raceType),
        );

        placeRecordList.push(
            MechanicalRacingPlaceRecord.create(
                placeId,
                raceType,
                new Date(currentDate),
                createPlace(raceType),
                createGrade(raceType),
                new Date(),
            ),
        );

        // レース情報を追加
        for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
            const raceId = generateRaceId(
                raceType,
                new Date(currentDate),
                createPlace(raceType),
                raceNumber,
            );
            raceRecordList.push(
                MechanicalRacingRaceRecord.create(
                    raceId,
                    raceType,
                    `レース${raceNumber}`,
                    createStage(raceType),
                    new Date(currentDate),
                    createPlace(raceType),
                    createGrade(raceType),
                    raceNumber,
                    new Date(),
                ),
            );

            // 選手データを追加
            for (
                let playerNumber = 1;
                playerNumber <= createPlayerNumber(raceType);
                playerNumber++
            ) {
                const playerId = generateRacePlayerId(
                    raceType,
                    new Date(currentDate),
                    createPlace(raceType),
                    raceNumber,
                    playerNumber,
                );
                racePlayerList.push(
                    RacePlayerRecord.create(
                        playerId,
                        raceType,
                        raceId,
                        playerNumber,
                        playerNumber + 10000,
                        new Date(),
                    ),
                );
            }
        }
    }
    return {
        placeRecord: placeRecordList,
        raceRecord: raceRecordList,
        racePlayerRecord: racePlayerList,
    };
}

// CSV出力
function writePlaceCsv(
    rows: MechanicalRacingPlaceRecord[],
    filePath: string,
): void {
    const header = 'id,dateTime,location,grade,updateDate';
    const lines = rows.map(
        (r) =>
            `${r.id},${r.dateTime.toISOString()},${r.location},${r.grade},${r.updateDate.toISOString()}`,
    );
    fs.writeFileSync(filePath, [header, ...lines].join('\n'), 'utf8');
    console.log(`CSVファイルを出力しました: ${filePath}`);
}

// CSV出力
function writeRaceCsv(
    rows: MechanicalRacingRaceRecord[],
    filePath: string,
): void {
    const header = 'id,name,stage,dateTime,location,grade,number,updateDate';
    const lines = rows.map(
        (r) =>
            `${r.id},${r.name},${r.stage},${r.dateTime.toISOString()},${r.location},${r.grade},${r.number},${r.updateDate.toISOString()}`,
    );
    fs.writeFileSync(filePath, [header, ...lines].join('\n'), 'utf8');
    console.log(`CSVファイルを出力しました: ${filePath}`);
}

// CSV出力
function writePlayerCsv(rows: RacePlayerRecord[], filePath: string): void {
    const header = 'id,raceId,positionNumber,playerNumber,updateDate';
    const lines = rows.map(
        (r) =>
            `${r.id},${r.raceId},${r.positionNumber},${r.playerNumber},${r.updateDate.toISOString()}`,
    );
    fs.writeFileSync(filePath, [header, ...lines].join('\n'), 'utf8');
    console.log(`CSVファイルを出力しました: ${filePath}`);
}

function main(): void {
    for (const raceType of [
        RaceType.AUTORACE,
        RaceType.KEIRIN,
        RaceType.BOATRACE,
    ]) {
        const data = generateMechanicalRacingData(raceType);
        writePlaceCsv(data.placeRecord, outputPath(raceType, 'placeList'));
        writeRaceCsv(data.raceRecord, outputPath(raceType, 'raceList'));
        writePlayerCsv(
            data.racePlayerRecord,
            outputPath(raceType, 'racePlayerList'),
        );
    }
}

main();
