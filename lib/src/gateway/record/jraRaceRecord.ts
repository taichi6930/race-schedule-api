import '../../utility/format';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { JraGradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import {
    type JraRaceCourse,
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
import {
    type RaceNumber,
    validateRaceNumber,
} from '../../utility/data/common/raceNumber';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../../utility/data/jra/jraHeldTimes';
import {
    type JraRaceId,
    validateJraRaceId,
} from '../../utility/data/jra/jraRaceId';
import {
    type JraRaceName,
    validateJraRaceName,
} from '../../utility/data/jra/jraRaceName';
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
        public readonly id: JraRaceId,
        public readonly name: JraRaceName,
        public readonly dateTime: RaceDateTime,
        public readonly location: JraRaceCourse,
        public readonly surfaceType: RaceCourseType,
        public readonly distance: RaceDistance,
        public readonly grade: JraGradeType,
        public readonly number: RaceNumber,
        public readonly heldTimes: JraHeldTimes,
        public readonly heldDayTimes: JraHeldDayTimes,
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
                validateJraRaceId(id),
                validateJraRaceName(name),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.JRA, location),
                validateRaceCourseType(surfaceType),
                validateRaceDistance(distance),
                validateGradeType(RaceType.JRA, grade),
                validateRaceNumber(number),
                validateJraHeldTimes(heldTimes),
                validateJraHeldDayTimes(heldDayTimes),
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
            JraRaceData.create(
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
