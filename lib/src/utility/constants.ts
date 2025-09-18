// S3関連CSVファイル名を一元管理
export const CSV_FILE_NAME = {
    PLACE_LIST: 'placeList.csv',
    RACE_LIST: 'raceList.csv',
    RACE_PLAYER_LIST: 'racePlayerList.csv',
    GRADE_LIST: 'gradeList.csv',
    HELD_DAY_LIST: 'heldDayList.csv',
    PLAYER_LIST: 'playerList.csv',
} as const;

// CSV ヘッダで使用されるフィールド名を定数化
export const CSV_HEADER_KEYS = {
    ID: 'id',
    DATE_TIME: 'dateTime',
    LOCATION: 'location',
    UPDATE_DATE: 'updateDate',
    NAME: 'name',
    SURFACE_TYPE: 'surfaceType',
    DISTANCE: 'distance',
    GRADE: 'grade',
    NUMBER: 'number',
    HELD_TIMES: 'heldTimes',
    HELD_DAY_TIMES: 'heldDayTimes',
    STAGE: 'stage',
    RACE_TYPE: 'raceType',
    RACE_ID: 'raceId',
    POSITION_NUMBER: 'positionNumber',
    PLAYER_NUMBER: 'playerNumber',
    PLAYER_NO: 'playerNo',
    PLAYER_NAME: 'playerName',
    PRIORITY: 'priority',
} as const;
