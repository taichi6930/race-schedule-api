import '../../utility/format';

import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../utility/data/autorace';
import type { AutoraceRaceId } from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: AutoraceRaceId,
        public readonly name: string, // レース名
        public readonly stage: AutoraceRaceStage, // 開催ステージ
        public readonly dateTime: Date, // 開催日時
        public readonly location: AutoraceRaceCourse, // オートレース場名
        public readonly grade: AutoraceGradeType, // グレード
        public readonly number: number, // レース番号
        public readonly updateDate: Date, // 更新日時
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceRecord> = {}): AutoraceRaceRecord {
        return new AutoraceRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }
}
