import type {
    KeirinGradeType,
    KeirinRaceCourse,
} from '../../utility/data/keirin';

/**
 * Repository層のRecord 競輪のレース開催場所データ
 */
export class KeirinPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - 競輪のグレード
     */
    constructor(
        public readonly id: string,
        public readonly dateTime: Date,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceRecord> = {}): KeirinPlaceRecord {
        return new KeirinPlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
