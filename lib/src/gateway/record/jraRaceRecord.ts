import '../../utility/format';

import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import {
    type heldDayTimes,
    validateHeldDayTimes,
} from '../../utility/data/common/heldDayTimes';
import {
    type HeldTimes,
    validateHeldTimes,
} from '../../utility/data/common/heldTimes';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import type { RaceCourseType } from '../../utility/data/common/raceCourseType';
import { validateRaceCourseType } from '../../utility/data/common/raceCourseType';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import type { RaceDistance } from '../../utility/data/common/raceDistance';
import { validateRaceDistance } from '../../utility/data/common/raceDistance';
import type { RaceId } from '../../utility/data/common/raceId';
import { validateRaceId } from '../../utility/data/common/raceId';
import {
    type RaceName,
    validateRaceName,
} from '../../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../../utility/data/common/raceNumber';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceRecord implements IRecord<JraRaceRecord> {
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
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
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
        public readonly grade: GradeType,
        public readonly number: RaceNumber,
        public readonly heldTimes: HeldTimes,
        public readonly heldDayTimes: heldDayTimes,
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
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
        heldTimes: number,
        heldDayTimes: number,
        updateDate: Date,
    ): JraRaceRecord {
        try {
            return new JraRaceRecord(
                validateRaceId(RaceType.JRA, id),
                validateRaceName(name),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.JRA, location),
                validateRaceCourseType(surfaceType),
                validateRaceDistance(distance),
                validateGradeType(RaceType.JRA, grade),
                validateRaceNumber(number),
                validateHeldTimes(heldTimes),
                validateHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('JraRaceRecordの生成に失敗しました', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<JraRaceRecord> = {}): JraRaceRecord {
        return JraRaceRecord.create(
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
     */
    public toEntity(): JraRaceEntity {
        return JraRaceEntity.create(
            this.id,
            RaceType.JRA,
            RaceData.create(
                RaceType.JRA,
                this.name,
                this.dateTime,
                this.location,
                this.grade,
                this.number,
            ),
            HeldDayData.create(this.heldTimes, this.heldDayTimes),
            HorseRaceConditionData.create(this.surfaceType, this.distance),
            this.updateDate,
        );
    }
}
