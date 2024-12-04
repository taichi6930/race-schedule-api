import '../../utility/format';

import type {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
} from '../../utility/data/world';
import type { WorldRaceId } from '../../utility/raceId';

/**
 * 地方競馬のレース開催データ
 */
export class WorldRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     *
     */
    constructor(
        public readonly id: WorldRaceId,
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: number,
        public readonly grade: WorldGradeType,
        public readonly number: number,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<WorldRaceRecord> = {}): WorldRaceRecord {
        return new WorldRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}