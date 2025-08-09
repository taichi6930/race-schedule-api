import '../../utility/format';

import fs from 'node:fs';
import path from 'node:path';

import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { generatePlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceRecord } from '../record/mechanicalRacingPlaceRecord';

// 出力先CSVファイルパス
const outputPath = (raceType: RaceType): string =>
    path.join(
        __dirname,
        `../mockData/csv/${raceType.toLowerCase()}/placeList.csv`,
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

function generatePlaceData(raceType: RaceType): MechanicalRacingPlaceRecord[] {
    // 2000年から2026年までのIDを生成
    const startDate = new Date('2000-01-01');
    const endDate = new Date('2026-01-01');

    const rows: MechanicalRacingPlaceRecord[] = [];

    // 1日ずつ増やしていく
    for (
        let currentDate = new Date(startDate);
        currentDate < endDate;
        currentDate.setDate(currentDate.getDate() + 1)
    ) {
        // レースIDを生成
        const id = generatePlaceId(
            raceType,
            currentDate,
            createPlace(raceType),
        );

        rows.push(
            MechanicalRacingPlaceRecord.create(
                id,
                raceType,
                new Date(currentDate),
                createPlace(raceType),
                createGrade(raceType),
                new Date(),
            ),
        );
    }
    return rows;
}

// CSV出力
function writeCsv(rows: MechanicalRacingPlaceRecord[], filePath: string): void {
    const header = 'id,dateTime,location,grade,updateDate';
    const lines = rows.map(
        (r) =>
            `${r.id},${r.dateTime.toISOString()},${r.location},${r.grade},${r.updateDate.toISOString()}`,
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
        const rows = generatePlaceData(raceType);
        writeCsv(rows, outputPath(raceType));
    }
}

main();
