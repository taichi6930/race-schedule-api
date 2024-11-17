import '../../utility/format';

import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';

/**
 * 競輪のレース開催データ
 */
export class BoatraceRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     *
     */
    constructor(
        public readonly id: string,
        public readonly name: string, // レース名
        public readonly stage: BoatraceRaceStage, // 開催ステージ
        public readonly dateTime: Date, // 開催日時
        public readonly location: BoatraceRaceCourse, // 競馬場名
        public readonly grade: BoatraceGradeType, // グレード
        public readonly number: number, // レース番号
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatraceRaceRecord> = {}): BoatraceRaceRecord {
        return new BoatraceRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}