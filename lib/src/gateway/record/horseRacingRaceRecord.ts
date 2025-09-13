import '../../../../src/utility/format';

import { HorseRaceConditionData } from '../../../../src/domain/houseRaceConditionData';
import { RaceData } from '../../../../src/domain/raceData';
import { createErrorMessage } from '../../../../src/utility/error';
import type { RaceType } from '../../../../src/utility/raceType';
import type { GradeType } from '../../../../src/utility/validateAndType/gradeType';
import { validateGradeType } from '../../../../src/utility/validateAndType/gradeType';
import type { RaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import { validateRaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import type { RaceDateTime } from '../../../../src/utility/validateAndType/raceDateTime';
import { validateRaceDateTime } from '../../../../src/utility/validateAndType/raceDateTime';
import type { RaceDistance } from '../../../../src/utility/validateAndType/raceDistance';
import { validateRaceDistance } from '../../../../src/utility/validateAndType/raceDistance';
import type { RaceId } from '../../../../src/utility/validateAndType/raceId';
import { validateRaceId } from '../../../../src/utility/validateAndType/raceId';
import type { RaceName } from '../../../../src/utility/validateAndType/raceName';
import { validateRaceName } from '../../../../src/utility/validateAndType/raceName';
import type { RaceNumber } from '../../../../src/utility/validateAndType/raceNumber';
import { validateRaceNumber } from '../../../../src/utility/validateAndType/raceNumber';
import type { RaceSurfaceType } from '../../../../src/utility/validateAndType/raceSurfaceType';
import { validateRaceSurfaceType } from '../../../../src/utility/validateAndType/raceSurfaceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * 競馬のレース開催データ
 */
export class HorseRacingRaceRecord {
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
        public readonly surfaceType: RaceSurfaceType,
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
                validateRaceSurfaceType(surfaceType),
                validateRaceDistance(distance),
                validateGradeType(raceType, grade),
                validateRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(createErrorMessage('RaceRecord', error));
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
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
     * RaceDataに変換する
     */
    public toRaceData(): RaceData {
        return RaceData.create(
            this.raceType,
            this.name,
            this.dateTime,
            this.location,
            this.grade,
            this.number,
        );
    }

    public toPlaceId(): string {
        return this.id.slice(0, -2);
    }

    /**
     * HorseRaceConditionDataに変換する
     */
    public toHorseRaceConditionData(): HorseRaceConditionData {
        return HorseRaceConditionData.create(this.surfaceType, this.distance);
    }
}
