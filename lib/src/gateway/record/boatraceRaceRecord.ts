import '../../utility/format';

import {
    type BoatraceGradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import {
    type BoatraceRaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import type { RaceId } from '../../utility/data/common/raceId';
import { validateRaceId } from '../../utility/data/common/raceId';
import type { RaceName } from '../../utility/data/common/raceName';
import { validateRaceName } from '../../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../../utility/data/common/raceNumber';
import {
    type RaceStage,
    validateRaceStage,
} from '../../utility/data/common/raceStage';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceRecord implements IRecord<BoatraceRaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
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
        public readonly name: RaceName,
        public readonly stage: RaceStage,
        public readonly dateTime: RaceDateTime,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly number: RaceNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
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
        name: string,
        stage: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
        updateDate: Date,
    ): BoatraceRaceRecord {
        try {
            return new BoatraceRaceRecord(
                validateRaceId(RaceType.BOATRACE, id),
                validateRaceName(name),
                validateRaceStage(RaceType.BOATRACE, stage),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.BOATRACE, location),
                validateGradeType(RaceType.BOATRACE, grade),
                validateRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(createErrorMessage('BoatraceRaceRecord', error));
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<BoatraceRaceRecord> = {}): BoatraceRaceRecord {
        return BoatraceRaceRecord.create(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }
}
