import path from 'node:path';

// データベース関連のパス
export const DB_PATH = path.join(process.cwd(), 'volume/data/race-schedule.db');
export const DB_FOLDER = path.dirname(DB_PATH);

// CSVファイルのパス
import { CSV_FILE_NAME } from '../../constants';

export const NAR_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/nar',
    CSV_FILE_NAME.PLACE_LIST,
);

export const JRA_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/jra',
    CSV_FILE_NAME.PLACE_LIST,
);
