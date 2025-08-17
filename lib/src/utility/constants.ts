// S3関連CSVファイル名を一元管理
export const CSV_FILE_NAME = {
    PLACE_LIST: 'placeList.csv',
    RACE_LIST: 'raceList.csv',
    RACE_PLAYER_LIST: 'racePlayerList.csv',
    GRADE_LIST: 'gradeList.csv',
    HELD_DAY_LIST: 'heldDayList.csv',
} as const;

/**
 * 指定した raceType が与えられた場合は "{raceType}/{fileName}" を返すユーティリティ
 * 例: csvPath('RACE_LIST', 'jra') => 'jra/raceList.csv'
 * @param fileKey
 * @param raceType
 */
export function csvPath(
    fileKey: keyof typeof CSV_FILE_NAME,
    raceType?: string,
): string {
    if (typeof raceType === 'string' && raceType.length > 0) {
        return `${raceType.toLowerCase()}/${CSV_FILE_NAME[fileKey]}`;
    }
    return CSV_FILE_NAME[fileKey];
}
