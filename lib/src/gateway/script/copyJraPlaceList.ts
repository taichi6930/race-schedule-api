import fs from 'node:fs';
import path from 'node:path';

import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';

// 入出力ファイルパス
const inputPath = path.resolve(__dirname, '../mockData/csv/jra/_placeList.csv');
const outputPath = path.resolve(
    __dirname,
    '../mockData/csv/jra',
    CSV_FILE_NAME.PLACE_LIST,
);

// _placeList.csvの内容を読み込む
const csv = fs.readFileSync(inputPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines[0].split(',');
const idIdx = header.indexOf(CSV_HEADER_KEYS.ID);
const dateTimeIdx = header.indexOf(CSV_HEADER_KEYS.DATE_TIME);
const locationIdx = header.indexOf(CSV_HEADER_KEYS.LOCATION);
const updateDateIdx = header.indexOf(CSV_HEADER_KEYS.UPDATE_DATE);

if ([idIdx, dateTimeIdx, locationIdx, updateDateIdx].includes(-1)) {
    throw new Error('_placeList.csvのヘッダーに必要なカラムがありません');
}

// 新しいCSVデータを作成（raceTypeはJRAで固定）
const outputHeader = [
    CSV_HEADER_KEYS.ID,
    CSV_HEADER_KEYS.RACE_TYPE,
    CSV_HEADER_KEYS.DATE_TIME,
    CSV_HEADER_KEYS.LOCATION,
    CSV_HEADER_KEYS.UPDATE_DATE,
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

console.log('_placeList.csvからplaceList.csvへコピー完了');
