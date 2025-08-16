import fs from 'node:fs';
import path from 'node:path';

// コマンドライン引数で対象ディレクトリを指定
const args = process.argv.slice(2);
const target = args[0] || 'keirin';
const validTargets = ['keirin', 'boatrace', 'autorace'];
if (!validTargets.includes(target)) {
    throw new Error(
        'Usage: ts-node generateGradeListFromPlaceList.ts [keirin|boatrace|autorace]',
    );
}

const inputPath = path.join(
    __dirname,
    `../mockData/csv/${target}/placeList.csv`,
);
const outputPath = path.join(
    __dirname,
    `../mockData/csv/${target}/gradeList.csv`,
);

// CSVをパースする関数
function parseCSV(data: string): string[][] {
    return data
        .trim()
        .split('\n')
        .map((line) => line.split(','));
}

// CSVとして書き出す関数
function toCSV(rows: string[][]): string {
    return rows.map((row) => row.join(',')).join('\n');
}

function main(): void {
    // ファイル読み込み
    if (!fs.existsSync(inputPath)) {
        throw new Error(`入力ファイルが存在しません: ${inputPath}`);
    }
    const csvData = fs.readFileSync(inputPath, 'utf8');
    const rows = parseCSV(csvData);
    const [header] = rows;

    // 必要なカラムのインデックス取得
    const idIdx = header.indexOf('id');
    const gradeIdx = header.indexOf('grade');
    const updateDateIdx = header.indexOf('updateDate');

    if (idIdx === -1 || gradeIdx === -1 || updateDateIdx === -1) {
        throw new Error('必要なカラムが見つかりません');
    }

    // データ抽出＆重複除外
    const seen = new Set<string>();
    const result: string[][] = [['id', 'grade', 'updateDate']];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const key = `${row[idIdx]},${row[gradeIdx]},${row[updateDateIdx]}`;
        if (!seen.has(key)) {
            seen.add(key);
            result.push([row[idIdx], row[gradeIdx], row[updateDateIdx]]);
        }
    }

    // ファイル出力
    fs.writeFileSync(outputPath, toCSV(result), 'utf8');
    console.log(`${target}/gradeList.csv を出力しました:`, outputPath);
}

main();
