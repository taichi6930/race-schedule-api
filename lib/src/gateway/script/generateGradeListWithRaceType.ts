import fs from 'node:fs';
import path from 'node:path';

// コマンドライン引数で対象ディレクトリを指定
const args = process.argv.slice(2);
const target = args[0] || 'keirin';
const validTargets = ['keirin', 'boatrace', 'autorace', 'nar'];
const raceTypeMap: Record<string, string> = {
    keirin: 'KEIRIN',
    boatrace: 'BOATRACE',
    autorace: 'AUTORACE',
    nar: 'NAR',
};
if (!validTargets.includes(target)) {
    throw new Error(
        'Usage: ts-node generateGradeListWithRaceType.ts [keirin|boatrace|autorace|nar]',
    );
}

const inputPath = path.join(
    __dirname,
    `../mockData/csv/${target}/gradeList.csv`,
);
const outputPath = inputPath; // 上書き

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
    const gradeIdx = header.indexOf('grade');
    const updateDateIdx = header.indexOf('updateDate');

    if (idIdx === -1 || gradeIdx === -1 || updateDateIdx === -1) {
        throw new Error('必要なカラムが見つかりません');
    }

    // raceType列を追加
    const result: string[][] = [['id', 'raceType', 'grade', 'updateDate']];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        result.push([
            row[idIdx],
            raceTypeMap[target],
            row[gradeIdx],
            row[updateDateIdx],
        ]);
    }

    fs.writeFileSync(outputPath, toCSV(result), 'utf8');
    console.log(
        `${target}/gradeList.csv をraceType付きで上書き出力しました:`,
        outputPath,
    );
}

main();
