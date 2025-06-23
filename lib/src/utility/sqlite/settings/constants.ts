import path from 'node:path';

// データベース関連のパス
export const DB_PATH = path.join(process.cwd(), 'volume/data/race-schedule.db');
export const DB_FOLDER = path.dirname(DB_PATH);

// CSVファイルのパス
export const NAR_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/nar/placeList.csv',
);

export const JRA_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/jra/placeList.csv',
);
