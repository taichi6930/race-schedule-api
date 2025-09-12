import fs from 'fs';
import path from 'path';

const file = '../lib/src/gateway/mockData/csv/nar/raceList.csv';
const chunkSize = 500;

const csvFile = path.resolve(__dirname, file);
if (!fs.existsSync(csvFile)) {
    console.error(`CSVファイルが見つかりません: ${csvFile}`);
    process.exit(1);
}
const csv = fs.readFileSync(csvFile, 'utf8');
const lines = csv.split('\n').filter(Boolean);
if (lines.length < 2) {
    console.warn(`CSVにデータがありません: ${csvFile}`);
    process.exit(1);
}
const header = lines[0].split(',');
const idx = {
    id: header.indexOf('id'),
    raceType: header.indexOf('raceType'),
    name: header.indexOf('name'),
    dateTime: header.indexOf('dateTime'),
    location: header.indexOf('location'),
    surfaceType: header.indexOf('surfaceType'),
    distance: header.indexOf('distance'),
    grade: header.indexOf('grade'),
    number: header.indexOf('number'),
    updateDate: header.indexOf('updateDate'),
};
const toSqliteDateTime = (src: string): string => {
    if (!src) return '';
    const d = new Date(src);
    if (isNaN(d.getTime())) return src;
    // JSTへ変換
    const jst = new Date(d.getTime() - 9 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${jst.getFullYear()}-${pad(jst.getMonth() + 1)}-${pad(jst.getDate())} ${pad(jst.getHours())}:${pad(jst.getMinutes())}:${pad(jst.getSeconds())}`;
};
const now = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const raceRecords: string[] = [];
const raceConditionRecords: string[] = [];
lines.slice(1).forEach((line) => {
    const cols = line.split(',');
    const id = cols[idx.id]?.replace(/'/g, "''") || '';
    // idの下2桁を削除してplace_idとする
    const place_id = id.slice(0, -2);
    const raceType = cols[idx.raceType]?.replace(/'/g, "''") || '';
    const name = cols[idx.name]?.replace(/'/g, "''") || '';
    const dateTimeRaw = cols[idx.dateTime]?.replace(/'/g, "''") || '';
    const dateTime = toSqliteDateTime(dateTimeRaw);
    const location = cols[idx.location]?.replace(/'/g, "''") || '';
    const grade = cols[idx.grade]?.replace(/'/g, "''") || '';
    const number = cols[idx.number]?.replace(/'/g, "''") || '';
    const surfaceType = cols[idx.surfaceType]?.replace(/'/g, "''") || '';
    const distance = cols[idx.distance]?.replace(/'/g, "''") || '';
    const updateDateRaw = cols[idx.updateDate]?.replace(/'/g, "''") || '';
    const updateDate = toSqliteDateTime(updateDateRaw);
    const createdAt = now();
    const updatedAt = updateDate || createdAt;
    // gradeがJpnⅠもしくはJpnⅡではない場合はreturn 配列で判定
    if (grade && !['重賞', '地方重賞', '地方準重賞'].includes(grade)) {
        return;
    }
    raceRecords.push(
        `('${id}', '${place_id}', '${raceType}', '${name}', '${dateTime}', '${location}', '${grade}', '${number}', '${createdAt}', '${updatedAt}')`,
    );
    raceConditionRecords.push(
        `('${id}', '${raceType}', '${surfaceType}', '${distance}', '${createdAt}', '${updatedAt}')`,
    );
});
let fileCount = 0;
for (let i = 0; i < raceRecords.length; i += chunkSize) {
    const raceChunk = raceRecords.slice(i, i + chunkSize);
    const raceSql = `INSERT INTO race (id, place_id, race_type, race_name, date_time, location_name, grade, race_number, created_at, updated_at) VALUES\n${raceChunk.join(',\n')}\nON CONFLICT(id) DO UPDATE SET place_id=excluded.place_id, race_type=excluded.race_type, race_name=excluded.race_name, date_time=excluded.date_time, location_name=excluded.location_name, grade=excluded.grade, race_number=excluded.race_number, updated_at=excluded.updated_at;\n`;
    const raceOutFile = path.resolve(__dirname, `insert_race_${fileCount}.sql`);
    fs.writeFileSync(raceOutFile, raceSql);
    const raceConditionChunk = raceConditionRecords.slice(i, i + chunkSize);
    const raceConditionSql = `INSERT INTO race_condition (id, race_type, surface_type, distance, created_at, updated_at) VALUES\n${raceConditionChunk.join(',\n')}\nON CONFLICT(id) DO UPDATE SET race_type=excluded.race_type, surface_type=excluded.surface_type, distance=excluded.distance, updated_at=excluded.updated_at;\n`;
    const raceConditionOutFile = path.resolve(
        __dirname,
        `insert_race_condition_${fileCount}.sql`,
    );
    fs.writeFileSync(raceConditionOutFile, raceConditionSql);
    console.log(
        `SQLファイルを生成しました: ${raceOutFile}, ${raceConditionOutFile}`,
    );
    fileCount++;
}
