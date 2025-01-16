import '../../utility/format';

import {
    type KeirinGradeType,
    validateKeirinGradeType,
} from '../../utility/data/keirin/keirinGradeType';
import {
    type KeirinRaceCourse,
    validateKeirinRaceCourse,
} from '../../utility/data/keirin/keirinRaceCourse';
import {
    type KeirinRaceDateTime,
    validateKeirinRaceDateTime,
} from '../../utility/data/keirin/keirinRaceDateTime';
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
import { type KeirinRaceId, validateKeirinRaceId } from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
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
        public readonly id: KeirinRaceId,
        public readonly name: KeirinRaceName,
        public readonly stage: KeirinRaceStage,
        public readonly dateTime: KeirinRaceDateTime,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
        public readonly number: KeirinRaceNumber,
        public readonly updateDate: Date,
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
    ): KeirinRaceRecord {
        try {
            return new KeirinRaceRecord(
                validateKeirinRaceId(id),
                validateKeirinRaceName(name),
                validateKeirinRaceStage(stage),
                validateKeirinRaceDateTime(dateTime),
                validateKeirinRaceCourse(location),
                validateKeirinGradeType(grade),
                validateKeirinRaceNumber(number),
                updateDate,
            );
        } catch (e) {
            throw new Error(
                `Failed to create KeirinRaceRecord: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRaceRecord> = {}): KeirinRaceRecord {
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
