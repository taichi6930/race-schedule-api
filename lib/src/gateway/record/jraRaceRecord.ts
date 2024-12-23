import '../../utility/format';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/jra';
import type { JraRaceId } from '../../utility/raceId';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: JraRaceId,
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
        public readonly surfaceType: JraRaceCourseType,
        public readonly distance: number,
        public readonly grade: JraGradeType,
        public readonly number: number,
        public readonly heldTimes: number,
        public readonly heldDayTimes: number,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraRaceRecord> = {}): JraRaceRecord {
        return new JraRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * JraRaceEntityに変換する
     * @returns
     */
    toEntity(): JraRaceEntity {
        return new JraRaceEntity(
            this.id,
            new JraRaceData(
                this.name,
                this.dateTime,
                this.location,
                this.surfaceType,
                this.distance,
                this.grade,
                this.number,
                this.heldTimes,
                this.heldDayTimes,
            ),
            this.updateDate,
        );
    }
}
