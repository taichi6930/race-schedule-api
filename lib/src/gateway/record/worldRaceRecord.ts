import '../../utility/format';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import {
    validateWorldGradeType,
    type WorldGradeType,
} from '../../utility/data/world/worldGradeType';
import {
    validateWorldRaceCourse,
    type WorldRaceCourse,
} from '../../utility/data/world/worldRaceCourse';
import {
    validateWorldRaceCourseType,
    type WorldRaceCourseType,
} from '../../utility/data/world/worldRaceCourseType';
import {
    validateWorldRaceDateTime,
    type WorldRaceDateTime,
} from '../../utility/data/world/worldRaceDateTime';
import {
    validateWorldRaceDistance,
    type WorldRaceDistance,
} from '../../utility/data/world/worldRaceDistance';
import { type WorldRaceId } from '../../utility/data/world/worldRaceId';
import {
    validateWorldRaceName,
    type WorldRaceName,
} from '../../utility/data/world/worldRaceName';
import {
    validateWorldRaceNumber,
    type WorldRaceNumber,
} from '../../utility/data/world/worldRaceNumber';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 地方競馬のレース開催データ
 */
export class WorldRaceRecord implements IRecord<WorldRaceRecord> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催データを生成する
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
    private constructor(
        public readonly id: WorldRaceId,
        public readonly name: WorldRaceName,
        public readonly dateTime: WorldRaceDateTime,
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: WorldRaceDistance,
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
    static create(
        id: WorldRaceId,
        name: WorldRaceName,
        dateTime: WorldRaceDateTime,
        location: WorldRaceCourse,
        surfaceType: WorldRaceCourseType,
        distance: WorldRaceDistance,
        grade: WorldGradeType,
        number: WorldRaceNumber,
        updateDate: Date,
    ): WorldRaceRecord {
        return new WorldRaceRecord(
            id,
            validateWorldRaceName(name),
            validateWorldRaceDateTime(dateTime),
            validateWorldRaceCourse(location),
            validateWorldRaceCourseType(surfaceType),
            validateWorldRaceDistance(distance),
            validateWorldGradeType(grade),
            validateWorldRaceNumber(number),
            validateUpdateDate(updateDate),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<WorldRaceRecord> = {}): WorldRaceRecord {
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
    toEntity(): WorldRaceEntity {
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
