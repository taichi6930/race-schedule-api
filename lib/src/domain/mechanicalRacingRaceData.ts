import {
    type GradeType,
    validateGradeType,
} from '../utility/data/common/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import {
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../utility/data/common/raceNumber';
import {
    type RaceStage,
    validateRaceStage,
} from '../utility/data/common/raceStage';
import type { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催データ
 */
export class MechanicalRacingRaceData
    implements IPlaceData<MechanicalRacingRaceData>
{
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
     * 開催ステージ
     * @type {RaceStage}
     */
    public readonly stage: RaceStage;
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
     * レース番号
     * @type {RaceNumber}
     */
    public readonly number: RaceNumber;

    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        raceType: RaceType,
        name: RaceName,
        stage: RaceStage,
        dateTime: RaceDateTime,
        location: RaceCourse,
        grade: GradeType,
        number: RaceNumber,
    ) {
        this.raceType = raceType;
        this.name = name;
        this.stage = stage;
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
        this.number = number;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType - レース種別
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    public static create(
        raceType: RaceType,
        name: string,
        stage: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
    ): MechanicalRacingRaceData {
        return new MechanicalRacingRaceData(
            raceType,
            validateRaceName(name),
            validateRaceStage(raceType, stage),
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
            validateGradeType(raceType, grade),
            validateRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<MechanicalRacingRaceData> = {},
    ): MechanicalRacingRaceData {
        return MechanicalRacingRaceData.create(
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
