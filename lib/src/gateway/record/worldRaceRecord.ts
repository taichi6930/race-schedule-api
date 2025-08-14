import '../../utility/format';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
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
import type { RaceNumber } from '../../utility/data/common/raceNumber';
import { validateRaceNumber } from '../../utility/data/common/raceNumber';
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
     * @param raceType - レース種別
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
        public readonly raceType: RaceType,
        public readonly name: RaceName,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly surfaceType: RaceCourseType,
        public readonly distance: RaceDistance,
        public readonly grade: GradeType,
        public readonly number: RaceNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
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
        raceType: RaceType,
        name: RaceName,
        dateTime: RaceDateTime,
        location: RaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: GradeType,
        number: RaceNumber,
        updateDate: Date,
    ): WorldRaceRecord {
        return new WorldRaceRecord(
            id,
            raceType,
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.WORLD, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(RaceType.WORLD, grade),
            validateRaceNumber(number),
            validateUpdateDate(updateDate),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<WorldRaceRecord> = {}): WorldRaceRecord {
        return WorldRaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
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
            RaceData.create(
                this.raceType,
                this.name,
                this.dateTime,
                this.location,
                this.grade,
                this.number,
            ),
            HorseRaceConditionData.create(this.surfaceType, this.distance),
            this.updateDate,
        );
    }
}
