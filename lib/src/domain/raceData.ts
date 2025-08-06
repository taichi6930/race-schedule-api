import type { GradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import {
    type RaceCourseType,
    validateRaceCourseType,
} from '../utility/data/common/raceCourseType';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import {
    type RaceDistance,
    validateRaceDistance,
} from '../utility/data/common/raceDistance';
import {
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import type { RaceNumber } from '../utility/data/common/raceNumber';
import { validateRaceNumber } from '../utility/data/common/raceNumber';
import type { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 競馬のレース開催データ
 */
export class RaceData implements IPlaceData<RaceData> {
    /**
     * レース種別
     * @type {RaceType}
     */
    public readonly raceType: RaceType;
    /**
     * レース名
     * @type {RaceName}
     */
    public readonly name: RaceName;
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
     * 馬場種別
     * @type {RaceCourseType}
     */
    public readonly surfaceType: RaceCourseType;
    /**
     * 距離
     * @type {RaceDistance}
     */
    public readonly distance: RaceDistance;
    /**
     * グレード
     * @type {GradeType}
     */
    public readonly grade: GradeType;
    /**
     * レース番号
     * @type {RaceNumber}
     */
    public readonly number: RaceNumber;

    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        raceType: RaceType,
        name: RaceName,
        dateTime: RaceDateTime,
        location: RaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: GradeType,
        number: RaceNumber,
    ) {
        this.raceType = raceType;
        this.name = name;
        this.dateTime = dateTime;
        this.location = location;
        this.surfaceType = surfaceType;
        this.distance = distance;
        this.grade = grade;
        this.number = number;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType - レース種別
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    public static create(
        raceType: RaceType,
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
    ): RaceData {
        return new RaceData(
            raceType,
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(raceType, grade),
            validateRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<RaceData> = {}): RaceData {
        return RaceData.create(
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
