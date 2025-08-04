import '../../utility/format';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { WorldGradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { validateRaceCourse } from '../../utility/data/common/raceCourse';
import {
    type RaceCourseType,
    validateRaceCourseType,
} from '../../utility/data/common/raceCourseType';
import type { RaceDateTime } from '../../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../../utility/data/common/raceDateTime';
import type { RaceDistance } from '../../utility/data/common/raceDistance';
import { validateRaceDistance } from '../../utility/data/common/raceDistance';
import type { RaceId } from '../../utility/data/common/raceId';
import {
    type RaceName,
    validateRaceName,
} from '../../utility/data/common/raceName';
import {
    validateWorldRaceNumber,
    type WorldRaceNumber,
} from '../../utility/data/world/worldRaceNumber';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 地方競馬のレース開催データ
 */
export class WorldRaceRecord implements IRecord<WorldRaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly name: RaceName,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly surfaceType: RaceCourseType,
        public readonly distance: RaceDistance,
        public readonly grade: WorldGradeType,
        public readonly number: WorldRaceNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     */
    public static create(
        id: RaceId,
        name: RaceName,
        dateTime: RaceDateTime,
        location: RaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: WorldGradeType,
        number: WorldRaceNumber,
        updateDate: Date,
    ): WorldRaceRecord {
        return new WorldRaceRecord(
            id,
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.WORLD, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(RaceType.WORLD, grade),
            validateWorldRaceNumber(number),
            validateUpdateDate(updateDate),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldRaceRecord> = {}): WorldRaceRecord {
        return WorldRaceRecord.create(
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
     * Entityに変換する
     */
    public toEntity(): WorldRaceEntity {
        return WorldRaceEntity.create(
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
