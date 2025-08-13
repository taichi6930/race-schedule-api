import fs from 'node:fs';
import path from 'node:path';

// 入出力ファイルパス
const inputPath = path.resolve(__dirname, '../mockData/csv/jra/_placeList.csv');
const outputPath = path.resolve(__dirname, '../mockData/csv/jra/placeList.csv');

// _placeList.csvの内容を読み込む
const csv = fs.readFileSync(inputPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines[0].split(',');
const idIdx = header.indexOf('id');
const dateTimeIdx = header.indexOf('dateTime');
const locationIdx = header.indexOf('location');
const updateDateIdx = header.indexOf('updateDate');

if ([idIdx, dateTimeIdx, locationIdx, updateDateIdx].includes(-1)) {
    throw new Error('_placeList.csvのヘッダーに必要なカラムがありません');
}

// 新しいCSVデータを作成（raceTypeはJRAで固定）
const outputLines = ['id,raceType,dateTime,location,updateDate'];

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
