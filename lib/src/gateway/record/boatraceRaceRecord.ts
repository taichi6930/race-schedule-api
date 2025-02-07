import '../../utility/format';

import {
    type BoatraceGradeType,
    validateBoatraceGradeType,
} from '../../utility/data/boatrace/boatraceGradeType';
import {
    type BoatraceRaceCourse,
    validateBoatraceRaceCourse,
} from '../../utility/data/boatrace/boatraceRaceCourse';
import {
    type BoatraceRaceDateTime,
    validateBoatraceRaceDateTime,
} from '../../utility/data/boatrace/boatraceRaceDateTime';
import {
    type BoatraceRaceId,
    validateBoatraceRaceId,
} from '../../utility/data/boatrace/boatraceRaceId';
import {
    type BoatraceRaceName,
    validateBoatraceRaceName,
} from '../../utility/data/boatrace/boatraceRaceName';
import {
    type BoatraceRaceNumber,
    validateBoatraceRaceNumber,
} from '../../utility/data/boatrace/boatraceRaceNumber';
import {
    type BoatraceRaceStage,
    validateBoatraceRaceStage,
} from '../../utility/data/boatrace/boatraceRaceStage';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceRecord implements IRecord<BoatraceRaceRecord> {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     *
     */
    private constructor(
        public readonly id: BoatraceRaceId,
        public readonly name: BoatraceRaceName,
        public readonly stage: BoatraceRaceStage,
        public readonly dateTime: BoatraceRaceDateTime,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly number: BoatraceRaceNumber,
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
    static create(
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
                validateBoatraceRaceId(id),
                validateBoatraceRaceName(name),
                validateBoatraceRaceStage(stage),
                validateBoatraceRaceDateTime(dateTime),
                validateBoatraceRaceCourse(location),
                validateBoatraceGradeType(grade),
                validateBoatraceRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(`BoatraceRaceRecord: ${(error as Error).message}`);
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatraceRaceRecord> = {}): BoatraceRaceRecord {
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
