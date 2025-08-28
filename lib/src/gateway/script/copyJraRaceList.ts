import fs from 'node:fs';
import path from 'node:path';

import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';

// 入出力ファイルパス
const inputPath = path.resolve(__dirname, '../mockData/csv/jra/raceList.csv');
const outputPath = path.resolve(
    __dirname,
    '../mockData/csv/jra',
    CSV_FILE_NAME.RACE_LIST,
);

// raceList.csv の内容を読み込む
const csv = fs.readFileSync(inputPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析して、必要なカラムのインデックスを取得
const header = lines[0].split(',');
const idIdx = header.indexOf(CSV_HEADER_KEYS.ID);
const raceTypeIdx = header.indexOf(CSV_HEADER_KEYS.RACE_TYPE);
const nameIdx = header.indexOf(CSV_HEADER_KEYS.NAME);
const dateTimeIdx = header.indexOf(CSV_HEADER_KEYS.DATE_TIME);
const locationIdx = header.indexOf(CSV_HEADER_KEYS.LOCATION);
const surfaceTypeIdx = header.indexOf(CSV_HEADER_KEYS.SURFACE_TYPE);
const distanceIdx = header.indexOf(CSV_HEADER_KEYS.DISTANCE);
const gradeIdx = header.indexOf(CSV_HEADER_KEYS.GRADE);
const numberIdx = header.indexOf(CSV_HEADER_KEYS.NUMBER);
const updateDateIdx = header.indexOf(CSV_HEADER_KEYS.UPDATE_DATE);

if (
    [
        idIdx,
        raceTypeIdx,
        nameIdx,
        dateTimeIdx,
        locationIdx,
        surfaceTypeIdx,
        distanceIdx,
        gradeIdx,
        numberIdx,
        updateDateIdx,
    ].includes(-1)
) {
    throw new Error('raceList.csv のヘッダーに必要なカラムがありません');
}

// 新しいCSVデータを作成（heldTimes と heldDayTimes を除外）
const outputHeader = [
    CSV_HEADER_KEYS.ID,
    CSV_HEADER_KEYS.RACE_TYPE,
    CSV_HEADER_KEYS.NAME,
    CSV_HEADER_KEYS.DATE_TIME,
    CSV_HEADER_KEYS.LOCATION,
    CSV_HEADER_KEYS.SURFACE_TYPE,
    CSV_HEADER_KEYS.DISTANCE,
    CSV_HEADER_KEYS.GRADE,
    CSV_HEADER_KEYS.NUMBER,
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
            cols[raceTypeIdx],
            cols[nameIdx],
            cols[dateTimeIdx],
            cols[locationIdx],
            cols[surfaceTypeIdx],
            cols[distanceIdx],
            cols[gradeIdx],
            cols[numberIdx],
            cols[updateDateIdx],
        ].join(','),
    );
}

// raceList.csv に書き込む（上書き）
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');

console.log('raceList.csv の変換（heldTimes/heldDayTimes 除去）完了');
