import type { NarGradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import {
    type NarRaceCourse,
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
    type NarRaceName,
    validateNarRaceName,
} from '../utility/data/nar/narRaceName';
import {
    type NarRaceNumber,
    validateNarRaceNumber,
} from '../utility/data/nar/narRaceNumber';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceData implements IPlaceData<NarRaceData> {
    /**
     * レース名
     * @type {NarRaceName}
     */
    public readonly name: NarRaceName;
    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {NarRaceCourse}
     */
    public readonly location: NarRaceCourse;
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
     * @type {NarGradeType}
     */
    public readonly grade: NarGradeType;
    /**
     * レース番号
     * @type {NarRaceNumber}
     */
    public readonly number: NarRaceNumber;

    /**
     * コンストラクタ
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
        name: NarRaceName,
        dateTime: RaceDateTime,
        location: NarRaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: NarGradeType,
        number: NarRaceNumber,
    ) {
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
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    public static create(
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
    ): NarRaceData {
        return new NarRaceData(
            validateNarRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.NAR, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(RaceType.NAR, grade),
            validateNarRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<NarRaceData> = {}): NarRaceData {
        return NarRaceData.create(
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
