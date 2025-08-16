import fs from 'node:fs';
import path from 'node:path';

// コマンドライン引数で対象ディレクトリを指定
const args = process.argv.slice(2);
const target = args[0] || 'keirin';
const validTargets = ['keirin', 'boatrace', 'autorace'];
if (!validTargets.includes(target)) {
    throw new Error(
        'Usage: ts-node generatePlaceListFromOld.ts [keirin|boatrace|autorace]',
    );
}

const inputPath = path.join(
    __dirname,
    `../mockData/csv/${target}/placeList_old.csv`,
);
const outputPath = path.join(
    __dirname,
    `../mockData/csv/${target}/placeList.csv`,
);

function parseCSV(data: string): string[][] {
    return data
        .trim()
        .split('\n')
        .map((line) => line.split(','));
}

function toCSV(rows: string[][]): string {
    return rows.map((row) => row.join(',')).join('\n');
}

function main(): void {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`入力ファイルが存在しません: ${inputPath}`);
    }
    const csvData = fs.readFileSync(inputPath, 'utf8');
    const rows = parseCSV(csvData);
    const [header] = rows;

    // 必要なカラムのインデックス取得
    const idIdx = header.indexOf('id');
    const dateTimeIdx = header.indexOf('dateTime');
    const locationIdx = header.indexOf('location');
    const updateDateIdx = header.indexOf('updateDate');

    if (
        idIdx === -1 ||
        dateTimeIdx === -1 ||
        locationIdx === -1 ||
        updateDateIdx === -1
    ) {
        throw new Error('必要なカラムが見つかりません');
    }

    // 新しいカラム順で出力
    const result: string[][] = [['id', 'dateTime', 'location', 'updateDate']];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        result.push([
            row[idIdx],
            row[dateTimeIdx],
            row[locationIdx],
            row[updateDateIdx],
        ]);
    }

    fs.writeFileSync(outputPath, toCSV(result), 'utf8');
    console.log(`${target}/placeList.csv を出力しました:`, outputPath);
}

main();
