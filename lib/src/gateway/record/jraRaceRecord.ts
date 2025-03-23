import '../../utility/format';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import {
    type JraGradeType,
    validateJraGradeType,
} from '../../utility/data/jra/jraGradeType';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../../utility/data/jra/jraHeldTimes';
import {
    type JraRaceCourse,
    validateJraRaceCourse,
} from '../../utility/data/jra/jraRaceCourse';
import {
    type JraRaceCourseType,
    validateJraRaceCourseType,
} from '../../utility/data/jra/jraRaceCourseType';
import {
    type JraRaceDateTime,
    validateJraRaceDateTime,
} from '../../utility/data/jra/jraRaceDateTime';
import {
    type JraRaceDistance,
    validateJraRaceDistance,
} from '../../utility/data/jra/jraRaceDistance';
import {
    type JraRaceId,
    validateJraRaceId,
} from '../../utility/data/jra/jraRaceId';
import {
    type JraRaceName,
    validateJraRaceName,
} from '../../utility/data/jra/jraRaceName';
import {
    type JraRaceNumber,
    validateJraRaceNumber,
} from '../../utility/data/jra/jraRaceNumber';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceRecord implements IRecord<JraRaceRecord> {
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
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: JraRaceId,
        public readonly name: JraRaceName,
        public readonly dateTime: JraRaceDateTime,
        public readonly location: JraRaceCourse,
        public readonly surfaceType: JraRaceCourseType,
        public readonly distance: JraRaceDistance,
        public readonly grade: JraGradeType,
        public readonly number: JraRaceNumber,
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
    static create(
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
                validateJraRaceDateTime(dateTime),
                validateJraRaceCourse(location),
                validateJraRaceCourseType(surfaceType),
                validateJraRaceDistance(distance),
                validateJraGradeType(grade),
                validateJraRaceNumber(number),
                validateJraHeldTimes(heldTimes),
                validateJraHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                `JraRaceRecordの生成に失敗しました: ${(error as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<JraRaceRecord> = {}): JraRaceRecord {
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
    toEntity(): JraRaceEntity {
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
