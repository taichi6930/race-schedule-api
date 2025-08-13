import fs from 'node:fs';
import path from 'node:path';

// 入出力ファイルパス
const placeListPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/placeList.csv',
);
const heldDayListPath = path.resolve(
    __dirname,
    '../mockData/csv/jra/heldDayList.csv',
);

// placeList.csvの内容を読み込む
const csv = fs.readFileSync(placeListPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);

// ヘッダーを解析
const header = lines[0].split(',');
const idIdx = header.indexOf('id');
const heldTimesIdx = header.indexOf('heldTimes');
const heldDayTimesIdx = header.indexOf('heldDayTimes');
const updateDateIdx = header.indexOf('updateDate');

if ([idIdx, heldTimesIdx, heldDayTimesIdx, updateDateIdx].includes(-1)) {
    throw new Error('placeList.csvのヘッダーに必要なカラムがありません');
}

// 新しいCSVデータを作成
const outputLines = ['id,heldTimes,heldDayTimes,updateDate'];
for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < header.length) {
        continue; // 空行や不正行はスキップ
    }
    outputLines.push(
        [
            cols[idIdx],
            cols[heldTimesIdx],
            cols[heldDayTimesIdx],
            cols[updateDateIdx],
        ].join(','),
    );
}

// heldDayList.csvに書き込む
fs.writeFileSync(heldDayListPath, outputLines.join('\n'), 'utf8');

console.log('placeList.csvからheldDayList.csvへコピー完了');
