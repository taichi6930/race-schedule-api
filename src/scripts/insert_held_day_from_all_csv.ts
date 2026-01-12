import fs from 'node:fs';
import path from 'node:path';

const file = '../lib/src/gateway/mockData/csv/jra/heldDayList.csv';
const chunkSize = 1000;

const csvFile = path.resolve(__dirname, file);
if (!fs.existsSync(csvFile)) {
    throw new Error(`CSVファイルが見つかりません: ${csvFile}`);
}
const csv = fs.readFileSync(csvFile, 'utf8');
const lines = csv.split('\n').filter(Boolean);
if (lines.length < 2) {
    throw new Error(`CSVにデータがありません: ${csvFile}`);
}
const header = lines[0].split(',');
const idx = {
    id: header.indexOf('id'),
    raceType: header.indexOf('raceType'),
    heldTimes: header.indexOf('heldTimes'),
    heldDayTimes: header.indexOf('heldDayTimes'),
};
const heldDayRecords: string[] = [];
for (const line of lines.slice(1)) {
    const cols = line.split(',');
    const id = cols[idx.id]?.replace(/'/g, "''") || '';
    const raceType = cols[idx.raceType]?.replace(/'/g, "''") || '';
    const heldTimes = Number(cols[idx.heldTimes] || 0);
    const heldDayTimes = Number(cols[idx.heldDayTimes] || 0);
    heldDayRecords.push(
        `('${id}', '${raceType}', ${heldTimes}, ${heldDayTimes})`,
    );
}
let fileCount = 0;
for (let i = 0; i < heldDayRecords.length; i += chunkSize) {
    const chunk = heldDayRecords.slice(i, i + chunkSize);
    const sql = `INSERT INTO held_day (id, race_type, held_times, held_day_times) VALUES\n${chunk.join(',\n')}\nON CONFLICT(id) DO UPDATE SET race_type=excluded.race_type, held_times=excluded.held_times, held_day_times=excluded.held_day_times;\n`;
    const outFile = path.resolve(__dirname, `insert_held_day_${fileCount}.sql`);
    fs.writeFileSync(outFile, sql);
    console.log(`SQLファイルを生成しました: ${outFile}`);
    fileCount++;
}
