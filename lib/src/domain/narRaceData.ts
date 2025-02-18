import {
    type NarGradeType,
    validateNarGradeType,
} from '../utility/data/nar/narGradeType';
import {
    type NarRaceCourse,
    validateNarRaceCourse,
} from '../utility/data/nar/narRaceCourse';
import {
    type NarRaceCourseType,
    validateNarRaceCourseType,
} from '../utility/data/nar/narRaceCourseType';
import {
    type NarRaceDateTime,
    validateNarRaceDateTime,
} from '../utility/data/nar/narRaceDateTime';
import {
    type NarRaceDistance,
    validateNarRaceDistance,
} from '../utility/data/nar/narRaceDistance';
import {
    type NarRaceName,
    validateNarRaceName,
} from '../utility/data/nar/narRaceName';
import {
    type NarRaceNumber,
    validateNarRaceNumber,
} from '../utility/data/nar/narRaceNumber';
import type { IPlaceData } from './iPlaceData';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceData implements IPlaceData<NarRaceData> {
    /**
     * レース名
     *
     * @type {NarRaceName}
     * @memberof NarRaceData
     */
    public readonly name: NarRaceName;
    /**
     * 開催日時
     *
     * @type {NarRaceDateTime}
     * @memberof NarRaceData
     */
    public readonly dateTime: NarRaceDateTime;
    /**
     * 開催場所
     *
     * @type {NarRaceCourse}
     * @memberof NarRaceData
     */
    public readonly location: NarRaceCourse;
    /**
     * 馬場種別
     *
     * @type {NarRaceCourseType}
     * @memberof NarRaceData
     */
    public readonly surfaceType: NarRaceCourseType;
    /**
     * 距離
     *
     * @type {NarRaceDistance}
     * @memberof NarRaceData
     */
    public readonly distance: NarRaceDistance;
    /**
     * グレード
     *
     * @type {NarGradeType}
     * @memberof NarRaceData
     */
    public readonly grade: NarGradeType;
    /**
     * レース番号
     *
     * @type {NarRaceNumber}
     * @memberof NarRaceData
     */
    public readonly number: NarRaceNumber;

    /**
     * コンストラクタ
     *
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
        name: NarRaceName,
        dateTime: NarRaceDateTime,
        location: NarRaceCourse,
        surfaceType: NarRaceCourseType,
        distance: NarRaceDistance,
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
    static create(
        name: string | undefined,
        dateTime: Date | string | undefined,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
    ): NarRaceData {
        return new NarRaceData(
            validateNarRaceName(name),
            validateNarRaceDateTime(dateTime),
            validateNarRaceCourse(location),
            validateNarRaceCourseType(surfaceType),
            validateNarRaceDistance(distance),
            validateNarGradeType(grade),
            validateNarRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<NarRaceData> = {}): NarRaceData {
        return new NarRaceData(
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
