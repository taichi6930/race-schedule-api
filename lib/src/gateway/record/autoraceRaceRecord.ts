import '../../utility/format';

import {
    type AutoraceGradeType,
    validateAutoraceGradeType,
} from '../../utility/data/autorace/autoraceGradeType';
import {
    type AutoraceRaceCourse,
    validateAutoraceRaceCourse,
} from '../../utility/data/autorace/autoraceRaceCourse';
import {
    type AutoraceRaceDateTime,
    validateAutoraceRaceDateTime,
} from '../../utility/data/autorace/autoraceRaceDateTime';
import {
    type AutoraceRaceId,
    validateAutoraceRaceId,
} from '../../utility/data/autorace/autoraceRaceId';
import {
    type AutoraceRaceName,
    validateAutoraceRaceName,
} from '../../utility/data/autorace/autoraceRaceName';
import {
    type AutoraceRaceNumber,
    validateAutoraceRaceNumber,
} from '../../utility/data/autorace/autoraceRaceNumber';
import {
    type AutoraceRaceStage,
    validateAutoraceRaceStage,
} from '../../utility/data/autorace/autoraceRaceStage';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
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
        public readonly id: AutoraceRaceId,
        public readonly name: AutoraceRaceName,
        public readonly stage: AutoraceRaceStage,
        public readonly dateTime: AutoraceRaceDateTime,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
        public readonly number: AutoraceRaceNumber,
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
    ): AutoraceRaceRecord {
        try {
            return new AutoraceRaceRecord(
                validateAutoraceRaceId(id),
                validateAutoraceRaceName(name),
                validateAutoraceRaceStage(stage),
                validateAutoraceRaceDateTime(dateTime),
                validateAutoraceRaceCourse(location),
                validateAutoraceGradeType(grade),
                validateAutoraceRaceNumber(number),
                updateDate,
            );
        } catch (error) {
            throw new Error(`AutoraceRaceRecord: ${(error as Error).message}`);
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceRecord> = {}): AutoraceRaceRecord {
        return AutoraceRaceRecord.create(
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
