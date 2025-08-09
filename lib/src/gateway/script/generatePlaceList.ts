import '../../utility/format';

import fs from 'node:fs';
import path from 'node:path';

import { generatePlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceRecord } from '../record/mechanicalRacingPlaceRecord';

// 出力先CSVファイルパス
const OUTPUT_PATH = path.join(
    __dirname,
    '../mockData/csv/autorace/placeList.csv',
);
function generatePlaceData(): MechanicalRacingPlaceRecord[] {
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
        const id = generatePlaceId(RaceType.AUTORACE, currentDate, '飯塚');

        // 開催地とグレードをランダムに選択
        const location = '飯塚';
        const grade = 'SG';

        rows.push(
            MechanicalRacingPlaceRecord.create(
                id,
                RaceType.AUTORACE,
                currentDate,
                location,
                grade,
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
    const rows = generatePlaceData();
    writeCsv(rows, OUTPUT_PATH);
}

main();
