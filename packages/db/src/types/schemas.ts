/**
 * データベーステーブルのスキーマ型定義
 * マイグレーションファイルに基づいて定義
 */

/**
 * place テーブル
 * 開催場ごとの基本情報（ID, 種別, 日時, 場所コード）を管理
 */
export interface PlaceRow {
    place_id: string; // 開催場ID（RaceType + YYYYMMDD + location_code）
    race_type: string; // レース種別（例: 競馬, 競輪, 競艇, オート）
    date_time: string; // 開催日時（YYYY-MM-DD HH:MM:SS）
    location_code: string; // 開催場コード
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}

/**
 * place_grade テーブル
 * 開催場グレード情報を管理
 */
export interface PlaceGradeRow {
    place_id: string; // 開催場ID（RaceType + YYYYMMDD + location_codeの組み合わせ）
    place_grade: string; // 開催場グレード（例: G1, G2, G3, 一般など）
    created_at: string; // レコード作成日時
    updated_at: string; // レコード更新日時
}

/**
 * place_held_day テーブル
 * 開催場ごとの開催回数・開催日数などを管理
 */
export interface PlaceHeldDayRow {
    place_id: string; // 開催場ID（RaceType + YYYYMMDD + location_code）
    held_times: number; // 開催回数
    held_day_times: number; // 開催日数
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}

/**
 * place_master テーブル
 * 開催場マスター情報を管理
 */
export interface PlaceMasterRow {
    race_type: string; // レース種別
    course_code_type: string; // コースコード種別
    place_name: string; // 開催場名
    place_code: string; // 開催場コード
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}

/**
 * player テーブル
 * 選手マスタ情報を管理
 */
export interface PlayerRow {
    race_type: string; // レース種別（JRA, NAR, KEIRIN, AUTORACE, BOATRACE）
    player_no: string; // 選手番号
    player_name: string; // 選手名
    priority: number; // 優先度
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}

/**
 * race テーブル
 * レース情報を管理
 */
export interface RaceRow {
    race_id: string; // レースID
    place_id: string; // 開催場ID（外部キー）
    race_type: string; // レース種別
    date_time: string; // 開催日時（YYYY-MM-DD HH:MM:SS）
    location_code: string; // 開催場コード
    race_number: number; // レース番号
    created_at: string; // 作成日時
    updated_at: string; // 更新日時
}

/**
 * INSERT用の型定義（created_at, updated_atを除外）
 */
export type PlaceInsert = Omit<PlaceRow, 'created_at' | 'updated_at'>;
export type PlaceGradeInsert = Omit<PlaceGradeRow, 'created_at' | 'updated_at'>;
export type PlaceHeldDayInsert = Omit<
    PlaceHeldDayRow,
    'created_at' | 'updated_at'
>;
export type PlaceMasterInsert = Omit<
    PlaceMasterRow,
    'created_at' | 'updated_at'
>;
export type PlayerInsert = Omit<PlayerRow, 'created_at' | 'updated_at'>;
export type RaceInsert = Omit<RaceRow, 'created_at' | 'updated_at'>;

/**
 * UPDATE用の型定義（主キーとタイムスタンプを除外）
 */
export type PlaceUpdate = Partial<
    Omit<PlaceRow, 'place_id' | 'created_at' | 'updated_at'>
>;
export type PlaceGradeUpdate = Partial<
    Omit<PlaceGradeRow, 'place_id' | 'created_at' | 'updated_at'>
>;
export type PlaceHeldDayUpdate = Partial<
    Omit<PlaceHeldDayRow, 'place_id' | 'created_at' | 'updated_at'>
>;
export type PlaceMasterUpdate = Partial<
    Omit<
        PlaceMasterRow,
        | 'race_type'
        | 'course_code_type'
        | 'place_name'
        | 'created_at'
        | 'updated_at'
    >
>;
export type PlayerUpdate = Partial<
    Omit<PlayerRow, 'race_type' | 'player_no' | 'created_at' | 'updated_at'>
>;
export type RaceUpdate = Partial<
    Omit<RaceRow, 'race_id' | 'created_at' | 'updated_at'>
>;
