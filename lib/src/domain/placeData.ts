import type { GradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import type { RaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import type { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * レース開催場所データ
 */
export class PlaceData implements IPlaceData<PlaceData> {
    /**
     * レース種別
     * @type {RaceType}
     */
    public readonly raceType: RaceType;
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
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        raceType: RaceType,
        dateTime: RaceDateTime,
        location: RaceCourse,
        grade: GradeType,
    ) {
        this.raceType = raceType;
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    public static create(
        raceType: RaceType,
        dateTime: Date,
        location: string,
        grade: string,
    ): PlaceData {
        return new PlaceData(
            raceType,
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
            validateGradeType(raceType, grade),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlaceData> = {}): PlaceData {
        return PlaceData.create(
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
