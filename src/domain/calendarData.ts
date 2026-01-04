import type { RaceType } from '../../packages/shared/src/types/raceType';

/**
 * カレンダーのデータを表すクラス
 */
export class CalendarData {
    /**
     * コンストラクタ
     * @param id - イベントID
     * @param raceType - レース種別
     * @param title - イベントタイトル
     * @param startTime - イベント開始時間
     * @param endTime - イベント終了時間
     * @param location - イベント場所
     * @param description - イベント説明
     * @remarks
     * カレンダーのデータを生成する
     */
    private constructor(
        public readonly id: string,
        public readonly raceType: RaceType,
        public readonly title: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly location: string,
        public readonly description: string,
    ) {}

    /**
     * インスタンスを生成する
     * @param id - イベントID
     * @param raceType - レース種別
     * @param title - イベントタイトル
     * @param startTime - イベント開始時間
     * @param endTime - イベント終了時間
     * @param location - イベント場所
     * @param description - イベント説明
     */
    public static create(
        id: string | null | undefined,
        raceType: RaceType,
        title: string | null | undefined,
        startTime: string | null | undefined,
        endTime: string | null | undefined,
        location: string | null | undefined,
        description: string | null | undefined,
    ): CalendarData {
        return new CalendarData(
            id ?? '',
            raceType,
            title ?? '',
            startTime ? new Date(startTime) : new Date(0),
            endTime ? new Date(endTime) : new Date(0),
            location ?? '',
            description ?? '',
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<CalendarData> = {}): CalendarData {
        return new CalendarData(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.title ?? this.title,
            partial.startTime ?? this.startTime,
            partial.endTime ?? this.endTime,
            partial.location ?? this.location,
            partial.description ?? this.description,
        );
    }
}
