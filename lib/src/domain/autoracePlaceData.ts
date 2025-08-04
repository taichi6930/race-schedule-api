import type { GradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import type { RaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催場所データ
 */
export class AutoracePlaceData implements IPlaceData<AutoracePlaceData> {
    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {RaceCourse}
     */
    public readonly location: RaceCourse;
    /**
     * グレード
     * @type {GradeType}
     */
    public readonly grade: GradeType;

    /**
     * コンストラクタ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        dateTime: RaceDateTime,
        location: RaceCourse,
        grade: GradeType,
    ) {
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    public static create(
        dateTime: Date,
        location: string,
        grade: string,
    ): AutoracePlaceData {
        return new AutoracePlaceData(
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.AUTORACE, location),
            validateGradeType(RaceType.AUTORACE, grade),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<AutoracePlaceData> = {}): AutoracePlaceData {
        return AutoracePlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
