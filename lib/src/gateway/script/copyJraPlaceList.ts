import fs from 'node:fs';
import path from 'node:path';

import { CSV_FILE_NAME } from '../../utility/constants';

// 入出力ファイルパス
const inputPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/raceList_archive.csv',
);
const outputPath = path.resolve(
    __dirname,
    '../mockData/csv/jra',
    CSV_FILE_NAME.PLACE_LIST,
);

// raceList_archive.csvの内容を読み込む
const csv = fs.readFileSync(inputPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines[0].split(',');
const idIdx = header.indexOf('id');
const dateTimeIdx = header.indexOf('dateTime');
const locationIdx = header.indexOf('location');
const updateDateIdx = header.indexOf('updateDate');

if ([idIdx, dateTimeIdx, locationIdx, updateDateIdx].includes(-1)) {
    throw new Error('raceList_archive.csvのヘッダーに必要なカラムがありません');
}

// 新しいCSVデータを作成（raceTypeはJRAで固定）
const outputHeader = [
    'id',
    'raceType',
    'dateTime',
    'location',
    'updateDate',
].join(',');
const outputLines = [outputHeader];

for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < header.length) {
        continue; // 空行や不正行はスキップ
    }
    outputLines.push(
        [
            cols[idIdx],
            'JRA',
            cols[dateTimeIdx],
            cols[locationIdx],
            cols[updateDateIdx],
        ].join(','),
    );
}

// placeList.csvに書き込む
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');

console.log('raceList_archive.csvからplaceList.csvへコピー完了');
