import {
    type JraGradeType,
    validateJraGradeType,
} from '../utility/data/jra/jraGradeType';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import {
    type JraRaceCourse,
    validateJraRaceCourse,
} from '../utility/data/jra/jraRaceCourse';
import {
    type JraRaceCourseType,
    validateJraRaceCourseType,
} from '../utility/data/jra/jraRaceCourseType';
import {
    type JraRaceDateTime,
    validateJraRaceDateTime,
} from '../utility/data/jra/jraRaceDateTime';
import {
    type JraRaceDistance,
    validateJraRaceDistance,
} from '../utility/data/jra/jraRaceDistance';
import {
    type JraRaceName,
    validateJraRaceName,
} from '../utility/data/jra/jraRaceName';
import {
    type JraRaceNumber,
    validateJraRaceNumber,
} from '../utility/data/jra/jraRaceNumber';
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
     * @type {JraRaceDateTime}
     */
    public readonly dateTime: JraRaceDateTime;
    /**
     * 開催場所
     * @type {JraRaceCourse}
     */
    public readonly location: JraRaceCourse;
    /**
     * 馬場種別
     * @type {JraRaceCourseType}
     */
    public readonly surfaceType: JraRaceCourseType;
    /**
     * 距離
     * @type {JraRaceDistance}
     */
    public readonly distance: JraRaceDistance;
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
        dateTime: JraRaceDateTime,
        location: JraRaceCourse,
        surfaceType: JraRaceCourseType,
        distance: JraRaceDistance,
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
            validateJraRaceDateTime(dateTime),
            validateJraRaceCourse(location),
            validateJraRaceCourseType(surfaceType),
            validateJraRaceDistance(distance),
            validateJraGradeType(grade),
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
