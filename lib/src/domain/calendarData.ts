/**
 * カレンダーのデータを表すクラス
 */
export class CalendarData {
    /**
     * コンストラクタ
     * @remarks
     * カレンダーのデータを生成する
     * @param id - イベントID
     * @param title - イベントタイトル
     * @param startTime - イベント開始時間
     * @param endTime - イベント終了時間
     * @param location - イベント場所
     * @param description - イベント説明
     */
    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly location: string,
        public readonly description: string,
    ) {}

    /**
     * インスタンスを生成する
     * @param id
     * @param title
     * @param startTime
     * @param endTime
     * @param location
     * @param description
     */
    public static create(
        id: string | null | undefined,
        title: string | null | undefined,
        startTime: string | null | undefined,
        endTime: string | null | undefined,
        location: string | null | undefined,
        description: string | null | undefined,
    ): CalendarData {
        return new CalendarData(
            id ?? '',
            title ?? '',
            startTime ? new Date(startTime) : new Date(0),
            endTime ? new Date(endTime) : new Date(0),
            location ?? '',
            description ?? '',
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<CalendarData> = {}): CalendarData {
        return new CalendarData(
            partial.id ?? this.id,
            partial.title ?? this.title,
            partial.startTime ?? this.startTime,
            partial.endTime ?? this.endTime,
            partial.location ?? this.location,
            partial.description ?? this.description,
        );
    }
}
