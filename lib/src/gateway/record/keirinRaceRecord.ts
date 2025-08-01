import '../../utility/format';

import type { KeirinGradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import {
    type KeirinRaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import {
    type KeirinRaceId,
    validateKeirinRaceId,
} from '../../utility/data/keirin/keirinRaceId';
import {
    type KeirinRaceName,
    validateKeirinRaceName,
} from '../../utility/data/keirin/keirinRaceName';
import {
    type KeirinRaceNumber,
    validateKeirinRaceNumber,
} from '../../utility/data/keirin/keirinRaceNumber';
import {
    type KeirinRaceStage,
    validateKeirinRaceStage,
} from '../../utility/data/keirin/keirinRaceStage';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceRecord implements IRecord<KeirinRaceRecord> {
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
        public readonly id: KeirinRaceId,
        public readonly name: KeirinRaceName,
        public readonly stage: KeirinRaceStage,
        public readonly dateTime: RaceDateTime,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
        public readonly number: KeirinRaceNumber,
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
    ): KeirinRaceRecord {
        try {
            return new KeirinRaceRecord(
                validateKeirinRaceId(id),
                validateKeirinRaceName(name),
                validateKeirinRaceStage(stage),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.KEIRIN, location),
                validateGradeType(RaceType.KEIRIN, grade),
                validateKeirinRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create KeirinRaceRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<KeirinRaceRecord> = {}): KeirinRaceRecord {
        return KeirinRaceRecord.create(
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
