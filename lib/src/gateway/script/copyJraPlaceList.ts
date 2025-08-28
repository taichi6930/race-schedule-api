import fs from 'node:fs';
import path from 'node:path';

// 入出力ファイルパス
const placeListPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/placeList.csv',
);
const placeListOldPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/placeList_old.csv',
);
const outputPath = placeListPath;

// 2つのCSVを読み込む
const csv1 = fs.readFileSync(placeListPath, 'utf8');
const csv2 = fs.readFileSync(placeListOldPath, 'utf8');
const lines1 = csv1.split(/\r?\n/).filter(Boolean);
const lines2 = csv2.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines1[0].split(',');
const idIdx = header.indexOf('id');
const raceTypeIdx = header.indexOf('raceType');
const dateTimeIdx = header.indexOf('dateTime');
const locationIdx = header.indexOf('location');
const updateDateIdx = header.indexOf('updateDate');

if (
    [idIdx, raceTypeIdx, dateTimeIdx, locationIdx, updateDateIdx].includes(-1)
) {
    throw new Error('placeList.csvのヘッダーに必要なカラムがありません');
}

const outputHeader = header.join(',');
const outputLines = [outputHeader];

// idごとに最新のデータを保持
const idMap = new Map();
function addToMap(lines: string[]): void {
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < header.length) {
            continue;
        }
        const id = cols[idIdx];
        const updateDate = cols[updateDateIdx];
        if (
            !idMap.has(id) ||
            new Date(updateDate) > new Date(idMap.get(id)[updateDateIdx])
        ) {
            idMap.set(id, cols);
        }
    }
}
addToMap(lines1);
addToMap(lines2);

// 出力
for (const cols of idMap.values()) {
    outputLines.push(cols.join(','));
}

// placeList.csvに書き込む
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');

console.log('raceList_archive.csvからplaceList.csvへコピー完了');
