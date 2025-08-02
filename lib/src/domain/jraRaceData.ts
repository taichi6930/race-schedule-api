import type { JraGradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import {
    type JraRaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import type { RaceCourseType } from '../utility/data/common/raceCourseType';
import { validateRaceCourseType } from '../utility/data/common/raceCourseType';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import {
    type RaceDistance,
    validateRaceDistance,
} from '../utility/data/common/raceDistance';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import {
    type JraRaceName,
    validateJraRaceName,
} from '../utility/data/jra/jraRaceName';
import {
    type JraRaceNumber,
    validateJraRaceNumber,
} from '../utility/data/jra/jraRaceNumber';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceData implements IPlaceData<JraRaceData> {
    /**
     * レース名
     * @type {JraRaceName}
     */
    public readonly name: JraRaceName;
    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {JraRaceCourse}
     */
    public readonly location: JraRaceCourse;
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
     * @type {JraGradeType}
     */
    public readonly grade: JraGradeType;
    /**
     * レース番号
     * @type {JraRaceNumber}
     */
    public readonly number: JraRaceNumber;
    /**
     * 開催回数
     * @type {JraHeldTimes}
     */
    public readonly heldTimes: JraHeldTimes;
    /**
     * 開催日数
     * @type {JraHeldDayTimes}
     */
    public readonly heldDayTimes: JraHeldDayTimes;

    /**
     * コンストラクタ
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        name: JraRaceName,
        dateTime: RaceDateTime,
        location: JraRaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: JraGradeType,
        number: JraRaceNumber,
        heldTimes: JraHeldTimes,
        heldDayTimes: JraHeldDayTimes,
    ) {
        this.name = name;
        this.dateTime = dateTime;
        this.location = location;
        this.surfaceType = surfaceType;
        this.distance = distance;
        this.grade = grade;
        this.number = number;
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    public static create(
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
        heldTimes: number,
        heldDayTimes: number,
    ): JraRaceData {
        return new JraRaceData(
            validateJraRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.JRA, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(RaceType.JRA, grade),
            validateJraRaceNumber(number),
            validateJraHeldTimes(heldTimes),
            validateJraHeldDayTimes(heldDayTimes),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<JraRaceData> = {}): JraRaceData {
        return JraRaceData.create(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
