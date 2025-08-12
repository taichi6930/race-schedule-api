import '../../utility/format';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceCourseType,
    validateRaceCourseType,
} from '../../utility/data/common/raceCourseType';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import {
    type RaceDistance,
    validateRaceDistance,
} from '../../utility/data/common/raceDistance';
import { type RaceId, validateRaceId } from '../../utility/data/common/raceId';
import {
    type RaceName,
    validateRaceName,
} from '../../utility/data/common/raceName';
import type { RaceNumber } from '../../utility/data/common/raceNumber';
import { validateRaceNumber } from '../../utility/data/common/raceNumber';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 競馬のレース開催データ
 */
export class HorseRacingRaceRecord implements IRecord<HorseRacingRaceRecord> {
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
        id: string,
        raceType: RaceType,
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
        updateDate: Date,
    ): HorseRacingRaceRecord {
        try {
            return new HorseRacingRaceRecord(
                validateRaceId(raceType, id),
                raceType,
                validateRaceName(name),
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
                validateRaceCourseType(surfaceType),
                validateRaceDistance(distance),
                validateGradeType(raceType, grade),
                validateRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<HorseRacingRaceRecord> = {},
    ): HorseRacingRaceRecord {
        return HorseRacingRaceRecord.create(
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
     * NarRaceEntityに変換する
     */
    public toEntity(): HorseRacingRaceEntity {
        return HorseRacingRaceEntity.create(
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
