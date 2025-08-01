import { validateGradeType } from '../utility/data/common/gradeType';
import {
    validateRaceCourse,
    type WorldRaceCourse,
} from '../utility/data/common/raceCourse';
import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import {
    type RaceDistance,
    validateRaceDistance,
} from '../utility/data/common/raceDistance';
import type { WorldGradeType } from '../utility/data/world/worldGradeType';
import {
    validateWorldRaceCourseType,
    type WorldRaceCourseType,
} from '../utility/data/world/worldRaceCourseType';
import {
    validateWorldRaceName,
    type WorldRaceName,
} from '../utility/data/world/worldRaceName';
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
     * @type {WorldRaceName}
     */
    public readonly name: WorldRaceName;
    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {WorldRaceCourse}
     */
    public readonly location: WorldRaceCourse;
    /**
     * 馬場種別
     * @type {WorldRaceCourseType}
     */
    public readonly surfaceType: WorldRaceCourseType;
    /**
     * 距離
     * @type {RaceDistance}
     */
    public readonly distance: RaceDistance;
    /**
     * グレード
     * @type {WorldGradeType}
     */
    public readonly grade: WorldGradeType;
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
        name: WorldRaceName,
        dateTime: RaceDateTime,
        location: WorldRaceCourse,
        surfaceType: WorldRaceCourseType,
        distance: RaceDistance,
        grade: WorldGradeType,
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
            validateWorldRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.WORLD, location),
            validateWorldRaceCourseType(surfaceType),
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
