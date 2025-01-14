import '../../utility/format';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { WorldGradeType } from '../../utility/data/world/worldGradeType';
import type { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';
import type { WorldRaceCourseType } from '../../utility/data/world/worldRaceCourseType';
import type { WorldRaceDateTime } from '../../utility/data/world/worldRaceDateTime';
import type { WorldRaceDistance } from '../../utility/data/world/worldRaceDistance';
import type { WorldRaceName } from '../../utility/data/world/worldRaceName';
import type { WorldRaceNumber } from '../../utility/data/world/worldRaceNumber';
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
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: WorldRaceId,
        public readonly name: WorldRaceName,
        public readonly dateTime: WorldRaceDateTime,
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: WorldRaceDistance,
        public readonly grade: WorldGradeType,
        public readonly number: WorldRaceNumber,
        public readonly updateDate: Date,
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
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * WorldRaceEntityに変換する
     * @returns
     */
    toEntity(): WorldRaceEntity {
        return new WorldRaceEntity(
            this.id,
            WorldRaceData.create(
                this.name,
                this.dateTime,
                this.location,
                this.surfaceType,
                this.distance,
                this.grade,
                this.number,
            ),
            this.updateDate,
        );
    }
}
