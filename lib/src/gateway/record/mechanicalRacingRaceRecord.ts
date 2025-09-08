import '../../utility/format';

import type { RaceType } from '../../../../src/utility/raceType';
import { createErrorMessage } from '../../utility/error';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import {
    type GradeType,
    validateGradeType,
} from '../../utility/validateAndType/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/validateAndType/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/validateAndType/raceDateTime';
import type { RaceId } from '../../utility/validateAndType/raceId';
import { validateRaceId } from '../../utility/validateAndType/raceId';
import type { RaceName } from '../../utility/validateAndType/raceName';
import { validateRaceName } from '../../utility/validateAndType/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../../utility/validateAndType/raceNumber';
import {
    type RaceStage,
    validateRaceStage,
} from '../../utility/validateAndType/raceStage';
import { RaceData } from './../../domain/raceData';

/**
 * レース開催データ
 */
export class MechanicalRacingRaceRecord {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
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
        public readonly stage: RaceStage,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly number: RaceNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceType: RaceType,
        name: string,
        stage: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
        updateDate: Date,
    ): MechanicalRacingRaceRecord {
        try {
            return new MechanicalRacingRaceRecord(
                validateRaceId(raceType, id),
                raceType,
                validateRaceName(name),
                validateRaceStage(raceType, stage),
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
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
        partial: Partial<MechanicalRacingRaceRecord> = {},
    ): MechanicalRacingRaceRecord {
        return MechanicalRacingRaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
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
}
