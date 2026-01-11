import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../packages/shared/src/types/raceDateTime';
import {
    type RaceName,
    validateRaceName,
} from '../../packages/shared/src/types/raceName';
import type { RaceNumber } from '../../packages/shared/src/types/raceNumber';
import { validateRaceNumber } from '../../packages/shared/src/types/raceNumber';
import type { RaceType } from '../../packages/shared/src/types/raceType';
import type { GradeType } from '../utility/validateAndType/gradeType';
import { validateGradeType } from '../utility/validateAndType/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../utility/validateAndType/raceCourse';

/**
 * 競馬のレース開催データ
 */
export class RaceData {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly name: RaceName,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly number: RaceNumber,
    ) {}

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType - レース種別
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    public static create(
        raceType: RaceType,
        name: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
    ): RaceData {
        return new RaceData(
            raceType,
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
            validateGradeType(raceType, grade),
            validateRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<RaceData> = {}): RaceData {
        return RaceData.create(
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
