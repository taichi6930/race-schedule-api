import fs from 'node:fs';
import path from 'node:path';

// 出力先CSVファイルパス
const OUTPUT_PATH = path.join(
    __dirname,
    '../mockData/csv/autorace/placeList.csv',
);

// ダミーの開催地リスト
const LOCATIONS = ['川口', '浜松', '伊勢崎', '山陽', '飯塚'];
// ダミーのグレードリスト
const GRADES = ['G1', 'G2', 'G3', '一般'];

// 30日分の日付を生成
function getDateList(days: number): string[] {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return d.toISOString().slice(0, 10); // YYYY-MM-DD
    });
}

// レースデータ生成
interface RaceRow {
    id: number;
    dateTime: string;
    location: string;
    grade: string;
    updateDate: string;
}

function generateRaceData(days: number): RaceRow[] {
    const dateList = getDateList(days);
    let id = 1;
    const updateDate = new Date().toISOString();
    const rows: RaceRow[] = [];
    for (const date of dateList) {
        for (const location of LOCATIONS) {
            const grade = GRADES[Math.floor(Math.random() * GRADES.length)];
            rows.push({
                id: id++,
                dateTime: date,
                location,
                grade,
                updateDate,
            });
        }
    }
    return rows;
}

// CSV出力
function writeCsv(rows: RaceRow[], filePath: string): void {
    const header = 'id,dateTime,location,grade,updateDate';
    const lines = rows.map(
        (r) => `${r.id},${r.dateTime},${r.location},${r.grade},${r.updateDate}`,
    );
    fs.writeFileSync(filePath, [header, ...lines].join('\n'), 'utf8');
    console.log(`CSVファイルを出力しました: ${filePath}`);
}

function main(): void {
    const rows = generateRaceData(30);
    writeCsv(rows, OUTPUT_PATH);
}

main();
