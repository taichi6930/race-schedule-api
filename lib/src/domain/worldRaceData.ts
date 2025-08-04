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
import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import {
    type RaceDistance,
    validateRaceDistance,
} from '../utility/data/common/raceDistance';
import {
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import {
    validateWorldRaceNumber,
    type WorldRaceNumber,
} from '../utility/data/world/worldRaceNumber';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 海外競馬のレース開催データ
 */
export class WorldRaceData implements IPlaceData<WorldRaceData> {
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
     * @type {WorldRaceNumber}
     */
    public readonly number: WorldRaceNumber;

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
        name: RaceName,
        dateTime: RaceDateTime,
        location: RaceCourse,
        surfaceType: RaceCourseType,
        distance: RaceDistance,
        grade: GradeType,
        number: WorldRaceNumber,
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
    ): WorldRaceData {
        return new WorldRaceData(
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.WORLD, location),
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
            validateGradeType(RaceType.WORLD, grade),
            validateWorldRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldRaceData> = {}): WorldRaceData {
        return WorldRaceData.create(
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
