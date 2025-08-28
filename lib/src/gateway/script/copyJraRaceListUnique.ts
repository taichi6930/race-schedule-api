import fs from 'node:fs';
import path from 'node:path';

// 入出力ファイルパス
const inputPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/raceList_archive.csv',
);
const outputPath = path.resolve(__dirname, '../mockData/csv/jra/raceList.csv');

// raceList_archive.csvの内容を読み込む
const csv = fs.readFileSync(inputPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines[0].split(',');
const idIdx = header.indexOf('id');
const updateDateIdx = header.indexOf('updateDate');

if (idIdx === -1 || updateDateIdx === -1) {
    throw new Error('raceList_archive.csvのヘッダーに必要なカラムがありません');
}

const outputLines = [header.join(',')];
const idMap = new Map<string, string[]>();
const dateTimeIdx = header.indexOf('dateTime');
for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < header.length) {
        continue;
    }
    const id = cols[idIdx];
    const updateDate = cols[updateDateIdx];
    if (
        !idMap.has(id) ||
        new Date(updateDate) > new Date((idMap.get(id) ?? [])[updateDateIdx])
    ) {
        idMap.set(id, cols);
    }
}
// dateTimeで降順ソート
const sorted = [...idMap.values()].sort(
    (a, b) =>
        new Date(b[dateTimeIdx]).getTime() - new Date(a[dateTimeIdx]).getTime(),
);
for (const cols of sorted) {
    outputLines.push(cols.join(','));
}
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');
console.log(
    'raceList_archive.csvからraceList.csvへコピー完了（重複idは最新updateDateのみ、dateTime昇順ソート）',
);
