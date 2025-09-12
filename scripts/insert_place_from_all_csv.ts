import fs from 'fs';
import path from 'path';

interface CsvFile {
    file: string;
    raceType: string;
}

const files: CsvFile[] = [
    {
        file: '../lib/src/gateway/mockData/csv/jra/placeList.csv',
        raceType: 'JRA',
    },
    {
        file: '../lib/src/gateway/mockData/csv/keirin/placeList.csv',
        raceType: 'KEIRIN',
    },
    // {
    //     file: '../lib/src/gateway/mockData/csv/nar/placeList.csv',
    //     raceType: 'NAR',
    // },
];

const chunkSize = 1500;

files.forEach(({ file, raceType }) => {
    const csvFile = path.resolve(__dirname, file);
    if (!fs.existsSync(csvFile)) {
        console.error(`CSVファイルが見つかりません: ${csvFile}`);
        return;
    }
    const csv = fs.readFileSync(csvFile, 'utf8');
    const lines = csv.split('\n').filter(Boolean);
    if (lines.length < 2) {
        console.warn(`CSVにデータがありません: ${csvFile}`);
        return;
    }
    const header = lines[0].split(',');
    const idx = {
        id: header.indexOf('id'),
        raceType: header.indexOf('raceType'),
        dateTime: header.indexOf('dateTime'),
        location: header.indexOf('location'),
    };
    const toSqliteDateTime = (src: string): string => {
        // JST変換: UTC→JST(+9h)
        if (!src) return '';
        const d = new Date(src);
        if (isNaN(d.getTime())) return src; // パース失敗時はそのまま
        // JSTへ変換
        const jst = new Date(d.getTime() - 9 * 60 * 60 * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${jst.getFullYear()}-${pad(jst.getMonth() + 1)}-${pad(jst.getDate())} ${pad(jst.getHours())}:${pad(jst.getMinutes())}:${pad(jst.getSeconds())}`;
    };

    const records: string[] = lines.slice(1).map((line) => {
        const cols = line.split(',');
        const id = cols[idx.id]?.replace(/'/g, "''") || '';
        const raceTypeVal = cols[idx.raceType]?.replace(/'/g, "''") || raceType;
        const dateTimeRaw = cols[idx.dateTime]?.replace(/'/g, "''") || '';
        const dateTime = toSqliteDateTime(dateTimeRaw);
        const location = cols[idx.location]?.replace(/'/g, "''") || '';
        return `('${id}', '${raceTypeVal}', '${dateTime}', '${location}')`;
    });
    let fileCount = 0;
    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const sql = `INSERT INTO place (id, race_type, date_time, location_name) VALUES\n${chunk.join(',\n')}\nON CONFLICT(id) DO UPDATE SET race_type=excluded.race_type, date_time=excluded.date_time, location_name=excluded.location_name;\n`;
        const outFile = path.resolve(
            __dirname,
            `insert_place_${raceType.toLowerCase()}_${fileCount}.sql`,
        );
        fs.writeFileSync(outFile, sql);
        console.log(`SQLファイルを生成しました: ${outFile}`);
        fileCount++;
    }
});
