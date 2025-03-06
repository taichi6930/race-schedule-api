import {
    validateWorldGradeType,
    type WorldGradeType,
} from '../utility/data/world/worldGradeType';
import {
    validateWorldRaceCourse,
    type WorldRaceCourse,
} from '../utility/data/world/worldRaceCourse';
import {
    validateWorldRaceCourseType,
    type WorldRaceCourseType,
} from '../utility/data/world/worldRaceCourseType';
import type { WorldRaceDateTime } from '../utility/data/world/worldRaceDateTime';
import { validateWorldRaceDateTime } from '../utility/data/world/worldRaceDateTime';
import {
    validateWorldRaceDistance,
    type WorldRaceDistance,
} from '../utility/data/world/worldRaceDistance';
import {
    validateWorldRaceName,
    type WorldRaceName,
} from '../utility/data/world/worldRaceName';
import {
    validateWorldRaceNumber,
    type WorldRaceNumber,
} from '../utility/data/world/worldRaceNumber';
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
     * @type {WorldRaceDateTime}
     */
    public readonly dateTime: WorldRaceDateTime;
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
     * @type {WorldRaceDistance}
     */
    public readonly distance: WorldRaceDistance;
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
     * @remarks
     * レース開催データを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    private constructor(
        name: WorldRaceName,
        dateTime: WorldRaceDateTime,
        location: WorldRaceCourse,
        surfaceType: WorldRaceCourseType,
        distance: WorldRaceDistance,
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
    static create(
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
            validateWorldRaceDateTime(dateTime),
            validateWorldRaceCourse(location),
            validateWorldRaceCourseType(surfaceType),
            validateWorldRaceDistance(distance),
            validateWorldGradeType(grade),
            validateWorldRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<WorldRaceData> = {}): WorldRaceData {
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
